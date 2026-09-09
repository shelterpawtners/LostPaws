-- Phase 2 Checkpoint 5: provider-independent savings attribution foundation.
-- This migration intentionally does NOT define or expose customer-facing
-- "verified savings". It captures candidate values and provenance only.

alter table public.redemptions
  add column if not exists reference_value_kind text
    check (reference_value_kind is null or reference_value_kind in ('list_price','retail_price','quoted_price','other')),
  add column if not exists reference_value_source text
    check (reference_value_source is null or reference_value_source in ('partner_attested','published_price','receipt','other','unknown')),
  add column if not exists evidence_reference text,
  add column if not exists evidence_metadata jsonb not null default '{}'::jsonb,
  add column if not exists shelterpawtners_relationship text
    check (shelterpawtners_relationship is null or shelterpawtners_relationship in ('first_known','returning')),
  add column if not exists partner_customer_attestation text
    check (partner_customer_attestation is null or partner_customer_attestation in ('new_to_business','existing_customer','unknown')),
  add column if not exists candidate_savings_minor bigint generated always as (
    case
      when retail_amount_minor is null or paid_amount_minor is null then null
      else greatest(retail_amount_minor - paid_amount_minor, 0)
    end
  ) stored;

alter table public.redemption_events
  add column if not exists retail_amount_delta_minor bigint,
  add column if not exists paid_amount_delta_minor bigint,
  add column if not exists currency_code char(3),
  add column if not exists metadata jsonb not null default '{}'::jsonb;

-- Redemption events are accounting/audit history. Keep corrections and reversals
-- append-only just like the economic ledger lines.
drop trigger if exists redemption_events_append_only on public.redemption_events;
create trigger redemption_events_append_only
before update or delete on public.redemption_events
for each row execute function private.block_all_mutation();

-- Replace the Checkpoint 4 confirmation RPC with a backwards-compatible
-- signature that accepts optional attribution. Existing callers can continue to
-- pass only p_code and p_location_id because p_attribution has a default.
drop function if exists public.confirm_redemption(text,uuid);

create function public.confirm_redemption(
  p_code text,
  p_location_id uuid default null,
  p_attribution jsonb default '{}'::jsonb
) returns uuid
language plpgsql security definer set search_path='' as $$
declare
  t private.secure_tokens;
  c public.offer_claims;
  o public.offers;
  r uuid:=gen_random_uuid();
  relationship text;
  retail_minor bigint;
  paid_minor bigint;
  currency text;
  reference_kind text;
  reference_source text;
  evidence_ref text;
  customer_attestation text;
  evidence jsonb;
begin
  if p_attribution is null then
    p_attribution := '{}'::jsonb;
  end if;
  if jsonb_typeof(p_attribution) <> 'object' then
    raise exception 'Attribution must be a JSON object';
  end if;

  select * into t
  from private.secure_tokens
  where token_digest=encode(extensions.digest(p_code,'sha256'),'hex')
    and purpose='guardian_redemption'
  for update;

  if t.id is null or t.revoked_at is not null or t.used_at is not null
     or (t.expires_at is not null and t.expires_at<=now()) then
    raise exception 'Code is invalid, expired, or already used';
  end if;

  select * into c from public.offer_claims where id=t.target_id for update;
  select * into o from public.offers where id=c.offer_id;

  if not private.can_manage_org(o.organization_id,array['owner','administrator','publisher','member']) then
    raise exception 'Not authorized for this Partner' using errcode='42501';
  end if;
  if c.status not in ('claimed','reserved') then
    raise exception 'Claim cannot be utilized';
  end if;

  retail_minor := nullif(p_attribution->>'retail_amount_minor','')::bigint;
  paid_minor := nullif(p_attribution->>'paid_amount_minor','')::bigint;
  currency := upper(coalesce(nullif(trim(p_attribution->>'currency_code'),''),'USD'));
  reference_kind := nullif(trim(p_attribution->>'reference_value_kind'),'');
  reference_source := nullif(trim(p_attribution->>'reference_value_source'),'');
  evidence_ref := nullif(trim(p_attribution->>'evidence_reference'),'');
  customer_attestation := nullif(trim(p_attribution->>'partner_customer_attestation'),'');
  evidence := coalesce(p_attribution->'evidence_metadata','{}'::jsonb);

  if retail_minor is not null and retail_minor < 0 then raise exception 'Retail/reference amount cannot be negative'; end if;
  if paid_minor is not null and paid_minor < 0 then raise exception 'Paid amount cannot be negative'; end if;
  if currency !~ '^[A-Z]{3}$' then raise exception 'Currency code must be a three-letter ISO-style code'; end if;
  if jsonb_typeof(evidence) <> 'object' then raise exception 'Evidence metadata must be a JSON object'; end if;

  -- Demo redemptions never affect customer relationship classification. For a
  -- real redemption, classify from prior non-demo confirmed history only.
  if c.is_demo then
    relationship := null;
  elsif exists(
    select 1 from public.redemptions prior
    where prior.guardian_id=c.guardian_id
      and prior.partner_organization_id=o.organization_id
      and prior.status='confirmed'
      and prior.is_demo=false
  ) then
    relationship := 'returning';
  else
    relationship := 'first_known';
  end if;

  insert into public.redemptions(
    id,claim_id,offer_id,offer_version_id,guardian_id,pet_id,
    partner_organization_id,organization_location_id,verification_method,
    confirmed_by,confirmed_at,status,is_demo,
    retail_amount_minor,paid_amount_minor,currency_code,
    reference_value_kind,reference_value_source,evidence_reference,evidence_metadata,
    shelterpawtners_relationship,partner_customer_attestation
  ) values(
    r,c.id,c.offer_id,c.offer_version_id,c.guardian_id,c.pet_id,
    o.organization_id,p_location_id,'opaque_code',
    auth.uid(),now(),'confirmed',c.is_demo,
    retail_minor,paid_minor,currency,
    reference_kind,reference_source,evidence_ref,evidence,
    relationship,customer_attestation
  );

  update public.offer_claims set status='utilized' where id=c.id;
  update private.secure_tokens set used_at=now() where id=t.id;
  insert into public.redemption_events(redemption_id,event_type,actor_id,metadata)
    values(r,'confirmed',auth.uid(),jsonb_build_object('relationship',relationship));
  insert into private.audit_events(actor_id,action,target_type,target_id,outcome,context)
    values(auth.uid(),'redemption.confirm','redemption',r,'success',
      jsonb_build_object('claim_id',c.id,'offer_version_id',c.offer_version_id,'relationship',relationship));
  return r;
end $$;

-- Corrections are deltas in append-only redemption history; they never silently
-- rewrite the originally captured values.
create or replace function public.record_redemption_adjustment(
  p_redemption_id uuid,
  p_retail_amount_delta_minor bigint default null,
  p_paid_amount_delta_minor bigint default null,
  p_reason text default null,
  p_metadata jsonb default '{}'::jsonb
) returns bigint
language plpgsql security definer set search_path='' as $$
declare
  r public.redemptions;
  event_id bigint;
begin
  select * into r from public.redemptions where id=p_redemption_id;
  if r.id is null or not private.can_manage_org(r.partner_organization_id,array['owner','administrator','publisher']) then
    raise exception 'Not authorized' using errcode='42501';
  end if;
  if r.status <> 'confirmed' then
    raise exception 'Only confirmed redemptions can be adjusted';
  end if;
  if coalesce(p_retail_amount_delta_minor,0)=0 and coalesce(p_paid_amount_delta_minor,0)=0 then
    raise exception 'At least one non-zero adjustment is required';
  end if;
  if p_metadata is null then p_metadata := '{}'::jsonb; end if;
  if jsonb_typeof(p_metadata) <> 'object' then raise exception 'Adjustment metadata must be a JSON object'; end if;

  insert into public.redemption_events(
    redemption_id,event_type,actor_id,reason,
    retail_amount_delta_minor,paid_amount_delta_minor,currency_code,metadata
  ) values(
    r.id,'corrected',auth.uid(),nullif(trim(p_reason),''),
    p_retail_amount_delta_minor,p_paid_amount_delta_minor,r.currency_code,p_metadata
  ) returning id into event_id;

  insert into private.audit_events(actor_id,action,target_type,target_id,outcome,context)
    values(auth.uid(),'redemption.adjust','redemption',r.id,'success',
      jsonb_build_object('redemption_event_id',event_id));
  return event_id;
end $$;

revoke insert,update,delete on public.redemption_events from authenticated;
grant select on public.redemption_events to authenticated;
grant execute on function public.confirm_redemption(text,uuid,jsonb) to authenticated;
grant execute on function public.record_redemption_adjustment(uuid,bigint,bigint,text,jsonb) to authenticated;
