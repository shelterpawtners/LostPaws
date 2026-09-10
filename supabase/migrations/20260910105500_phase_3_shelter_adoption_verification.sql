-- LL-3: Shelter/adoption verification golden path.
-- Reuses the existing adoption_verification_requests and private.secure_tokens
-- records. Raw responder tokens are returned only to service_role callers.

create or replace function public.request_adoption_verification(
  p_pet_id uuid,
  p_shelter_name text,
  p_shelter_contact_name text default null,
  p_shelter_email text default null,
  p_shelter_phone text default null,
  p_shelter_website_or_social text default null,
  p_pet_name_at_adoption text default null,
  p_approximate_adoption_date date default null
) returns uuid
language plpgsql security definer set search_path='' as $$
declare
  v_user uuid := auth.uid();
  v_request_id uuid;
begin
  if v_user is null then
    raise exception 'Authentication required' using errcode='42501';
  end if;
  if p_pet_id is null then
    raise exception 'Pet is required' using errcode='22023';
  end if;
  if coalesce(trim(p_shelter_name),'') = '' then
    raise exception 'Shelter or rescue name is required' using errcode='22023';
  end if;
  if nullif(trim(p_shelter_email),'') is null
     and nullif(trim(p_shelter_phone),'') is null
     and nullif(trim(p_shelter_website_or_social),'') is null then
    raise exception 'Provide a shelter email, phone, or website/social profile' using errcode='22023';
  end if;
  if not exists (
    select 1
    from public.guardianships g
    where g.pet_id=p_pet_id
      and g.guardian_id=v_user
      and g.relationship='primary'
      and g.status='active'
      and g.ended_at is null
  ) then
    raise exception 'Primary Guardian authority is required' using errcode='42501';
  end if;

  select r.id into v_request_id
  from public.adoption_verification_requests r
  where r.pet_id=p_pet_id
    and r.requested_by=v_user
    and r.status in ('draft','submitted','delivery_pending','sent','viewed','more_information_requested')
  order by r.created_at desc
  limit 1;

  if v_request_id is not null then
    return v_request_id;
  end if;

  update public.pets
  set adopted_self_reported=true, updated_at=now()
  where id=p_pet_id;

  insert into public.adoption_verification_requests(
    pet_id,requested_by,shelter_name,shelter_contact_name,shelter_email,
    shelter_phone,shelter_website_or_social,pet_name_at_adoption,
    approximate_adoption_date,contact_consent_at,status
  ) values (
    p_pet_id,v_user,trim(p_shelter_name),nullif(trim(p_shelter_contact_name),''),
    nullif(trim(p_shelter_email),''),nullif(trim(p_shelter_phone),''),
    nullif(trim(p_shelter_website_or_social),''),nullif(trim(p_pet_name_at_adoption),''),
    p_approximate_adoption_date,now(),'submitted'
  ) returning id into v_request_id;

  insert into private.audit_events(actor_id,action,target_type,target_id,outcome,context)
  values(v_user,'adoption_verification_requested','adoption_verification_request',v_request_id,'success','{}'::jsonb);

  return v_request_id;
end $$;

create or replace function public.issue_adoption_verification_token(p_request_id uuid)
returns table(responder_token text, expires_at timestamptz)
language plpgsql security definer set search_path='' as $$
declare
  v_request public.adoption_verification_requests;
  v_token text := replace(gen_random_uuid()::text,'-','') || replace(gen_random_uuid()::text,'-','');
  v_digest text := encode(extensions.digest(v_token,'sha256'),'hex');
  v_expires timestamptz := now() + interval '30 days';
begin
  select * into v_request
  from public.adoption_verification_requests
  where id=p_request_id
  for update;

  if v_request.id is null then
    raise exception 'Verification request not found' using errcode='P0002';
  end if;
  if v_request.status not in ('submitted','delivery_failed') then
    raise exception 'Verification request cannot issue a responder token in its current state' using errcode='22023';
  end if;

  update private.secure_tokens
  set revoked_at=coalesce(revoked_at,now())
  where purpose='adoption_verification'
    and target_type='adoption_verification_request'
    and target_id=p_request_id
    and revoked_at is null
    and used_at is null;

  insert into private.secure_tokens(
    purpose,token_digest,target_type,target_id,expires_at,created_by
  ) values (
    'adoption_verification',v_digest,'adoption_verification_request',p_request_id,
    v_expires,v_request.requested_by
  );

  update public.adoption_verification_requests
  set token_digest=v_digest,
      token_expires_at=v_expires,
      status='delivery_pending',
      next_reminder_at=null,
      updated_at=now()
  where id=p_request_id;

  insert into private.audit_events(actor_id,action,target_type,target_id,outcome,context)
  values(null,'adoption_verification_token_issued','adoption_verification_request',p_request_id,'success',jsonb_build_object('expires_at',v_expires));

  return query select v_token,v_expires;
end $$;

create or replace function public.record_adoption_verification_delivery(
  p_request_id uuid,
  p_delivered boolean
) returns void
language plpgsql security definer set search_path='' as $$
declare
  v_request public.adoption_verification_requests;
begin
  select * into v_request
  from public.adoption_verification_requests
  where id=p_request_id
  for update;

  if v_request.id is null then
    raise exception 'Verification request not found' using errcode='P0002';
  end if;
  if v_request.status <> 'delivery_pending' then
    raise exception 'Verification request is not awaiting delivery' using errcode='22023';
  end if;

  if coalesce(p_delivered,false) then
    update public.adoption_verification_requests
    set status='sent',
        sent_at=now(),
        next_reminder_at=now()+interval '10 days',
        updated_at=now()
    where id=p_request_id;
  else
    update public.adoption_verification_requests
    set status='delivery_failed',
        next_reminder_at=null,
        updated_at=now()
    where id=p_request_id;
  end if;

  insert into private.audit_events(actor_id,action,target_type,target_id,outcome,context)
  values(null,'adoption_verification_delivery','adoption_verification_request',p_request_id,
    case when coalesce(p_delivered,false) then 'success' else 'failed' end,'{}'::jsonb);
end $$;

create or replace function public.adoption_verification_by_token(p_token text)
returns table(
  shelter_name text,
  pet_name text,
  pet_name_at_adoption text,
  approximate_adoption_date date,
  verification_status public.verification_status,
  token_expires_at timestamptz
)
language plpgsql security definer set search_path='' as $$
declare
  v_token private.secure_tokens;
  v_request public.adoption_verification_requests;
begin
  if coalesce(length(trim(p_token)),0) < 32 then
    return;
  end if;

  select * into v_token
  from private.secure_tokens
  where token_digest=encode(extensions.digest(trim(p_token),'sha256'),'hex')
    and purpose='adoption_verification'
    and target_type='adoption_verification_request'
    and revoked_at is null
    and used_at is null
  limit 1;

  if v_token.id is null then
    return;
  end if;

  select * into v_request
  from public.adoption_verification_requests
  where id=v_token.target_id
  for update;

  if v_request.id is null then
    return;
  end if;

  if v_token.expires_at is not null and v_token.expires_at <= now() then
    if v_request.status not in ('confirmed','declined','expired','canceled') then
      update public.adoption_verification_requests
      set status='expired',next_reminder_at=null,updated_at=now()
      where id=v_request.id;
    end if;
    return;
  end if;

  if v_request.status not in ('submitted','delivery_pending','sent','viewed','more_information_requested') then
    return;
  end if;

  if v_request.viewed_at is null then
    update public.adoption_verification_requests
    set viewed_at=now(),
        status=case when status in ('submitted','delivery_pending','sent') then 'viewed' else status end,
        updated_at=now()
    where id=v_request.id;
  end if;

  return query
  select v_request.shelter_name,
         p.name,
         v_request.pet_name_at_adoption,
         v_request.approximate_adoption_date,
         (select r.status from public.adoption_verification_requests r where r.id=v_request.id),
         v_token.expires_at
  from public.pets p
  where p.id=v_request.pet_id;
end $$;

create or replace function public.respond_to_adoption_verification(
  p_token text,
  p_confirmed boolean,
  p_adoption_date date default null,
  p_responder_name text default null,
  p_responder_role text default null,
  p_notes text default null
) returns text
language plpgsql security definer set search_path='' as $$
declare
  v_token private.secure_tokens;
  v_request public.adoption_verification_requests;
  v_status text;
begin
  if coalesce(length(trim(p_token)),0) < 32 then
    return 'unavailable';
  end if;

  select * into v_token
  from private.secure_tokens
  where token_digest=encode(extensions.digest(trim(p_token),'sha256'),'hex')
    and purpose='adoption_verification'
    and target_type='adoption_verification_request'
    and revoked_at is null
    and used_at is null
  limit 1
  for update;

  if v_token.id is null then
    return 'unavailable';
  end if;

  select * into v_request
  from public.adoption_verification_requests
  where id=v_token.target_id
  for update;

  if v_request.id is null then
    return 'unavailable';
  end if;

  if v_token.expires_at is not null and v_token.expires_at <= now() then
    update public.adoption_verification_requests
    set status='expired',next_reminder_at=null,updated_at=now()
    where id=v_request.id
      and status not in ('confirmed','declined','expired','canceled');
    return 'unavailable';
  end if;

  if v_request.status not in ('submitted','delivery_pending','sent','viewed','more_information_requested') then
    return 'unavailable';
  end if;

  if coalesce(p_confirmed,false) then
    if coalesce(trim(p_responder_name),'')='' then
      raise exception 'Responder name is required to confirm an adoption' using errcode='22023';
    end if;
    if p_adoption_date is null then
      raise exception 'Adoption date is required to confirm an adoption' using errcode='22023';
    end if;

    update public.adoption_verification_requests
    set status='confirmed',
        responded_at=now(),
        response_adoption_date=p_adoption_date,
        responder_name=trim(p_responder_name),
        responder_role=nullif(trim(p_responder_role),''),
        responder_notes=nullif(trim(p_notes),''),
        next_reminder_at=null,
        updated_at=now()
    where id=v_request.id;

    update public.pets
    set shelter_confirmed_at=coalesce(shelter_confirmed_at,now()),updated_at=now()
    where id=v_request.pet_id;

    v_status := 'confirmed';
  else
    update public.adoption_verification_requests
    set status='declined',
        responded_at=now(),
        responder_name=nullif(trim(p_responder_name),''),
        responder_role=nullif(trim(p_responder_role),''),
        responder_notes=nullif(trim(p_notes),''),
        next_reminder_at=null,
        updated_at=now()
    where id=v_request.id;

    v_status := 'declined';
  end if;

  update private.secure_tokens set used_at=now() where id=v_token.id;

  insert into private.audit_events(actor_id,action,target_type,target_id,outcome,context)
  values(null,'adoption_verification_responded','adoption_verification_request',v_request.id,'success',jsonb_build_object('response',v_status));

  return v_status;
end $$;

create or replace function public.record_adoption_verification_reminder(
  p_request_id uuid,
  p_next_reminder_at timestamptz default null
) returns smallint
language plpgsql security definer set search_path='' as $$
declare
  v_request public.adoption_verification_requests;
  v_count smallint;
begin
  select * into v_request
  from public.adoption_verification_requests
  where id=p_request_id
  for update;

  if v_request.id is null then
    raise exception 'Verification request not found' using errcode='P0002';
  end if;
  if v_request.status not in ('sent','viewed') then
    raise exception 'Verification request is not eligible for reminders' using errcode='22023';
  end if;
  if v_request.token_expires_at is null or v_request.token_expires_at <= now() then
    raise exception 'Verification link has expired' using errcode='22023';
  end if;
  if v_request.reminder_count >= 3 then
    raise exception 'Maximum reminder count reached' using errcode='22023';
  end if;
  if v_request.reminder_count=0
     and (v_request.sent_at is null or now() < v_request.sent_at + interval '10 days') then
    raise exception 'First reminder is not due yet' using errcode='22023';
  end if;
  if p_next_reminder_at is not null
     and (p_next_reminder_at <= now() or p_next_reminder_at >= v_request.token_expires_at) then
    raise exception 'Next reminder must be in the future and before token expiry' using errcode='22023';
  end if;

  v_count := v_request.reminder_count + 1;
  update public.adoption_verification_requests
  set reminder_count=v_count,
      next_reminder_at=case when v_count>=3 then null else p_next_reminder_at end,
      updated_at=now()
  where id=p_request_id;

  insert into private.audit_events(actor_id,action,target_type,target_id,outcome,context)
  values(null,'adoption_verification_reminder_recorded','adoption_verification_request',p_request_id,'success',jsonb_build_object('reminder_count',v_count));

  return v_count;
end $$;

revoke all on function public.request_adoption_verification(uuid,text,text,text,text,text,text,date) from public,anon;
grant execute on function public.request_adoption_verification(uuid,text,text,text,text,text,text,date) to authenticated;

revoke all on function public.issue_adoption_verification_token(uuid) from public,anon,authenticated;
grant execute on function public.issue_adoption_verification_token(uuid) to service_role;

revoke all on function public.record_adoption_verification_delivery(uuid,boolean) from public,anon,authenticated;
grant execute on function public.record_adoption_verification_delivery(uuid,boolean) to service_role;

revoke all on function public.adoption_verification_by_token(text) from public,anon,authenticated;
grant execute on function public.adoption_verification_by_token(text) to anon,authenticated;

revoke all on function public.respond_to_adoption_verification(text,boolean,date,text,text,text) from public,anon,authenticated;
grant execute on function public.respond_to_adoption_verification(text,boolean,date,text,text,text) to anon,authenticated;

revoke all on function public.record_adoption_verification_reminder(uuid,timestamptz) from public,anon,authenticated;
grant execute on function public.record_adoption_verification_reminder(uuid,timestamptz) to service_role;
