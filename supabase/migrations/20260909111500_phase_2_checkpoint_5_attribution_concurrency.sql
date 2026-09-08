-- Phase 2 Checkpoint 5: serialize first-known/returning attribution.
--
-- Two different redemption claims for the same Guardian + Partner can be
-- confirmed concurrently. Without serialization, both transactions can observe
-- no prior confirmed redemption and both persist `first_known`.
--
-- Keep the application behavior unchanged while enforcing one durable
-- first-known relationship per Guardian + Partner.

do $$
begin
  if exists (
    select 1
    from public.redemptions
    where status = 'confirmed'
      and is_demo = false
      and shelterpawtners_relationship = 'first_known'
    group by guardian_id, partner_organization_id
    having count(*) > 1
  ) then
    raise exception 'Duplicate first_known Guardian + Partner relationships already exist; inspect before applying concurrency guard';
  end if;
end $$;

create unique index if not exists redemptions_one_first_known_per_guardian_partner
  on public.redemptions(guardian_id, partner_organization_id)
  where status = 'confirmed'
    and is_demo = false
    and shelterpawtners_relationship = 'first_known';

create or replace function public.confirm_redemption(
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

  -- The secure-token row serializes replay of one code. This advisory lock
  -- additionally serializes classification across *different* claims for the
  -- same Guardian + Partner organization.
  if c.is_demo then
    relationship := null;
  else
    perform pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended(c.guardian_id::text || ':' || o.organization_id::text, 0)
    );

    if exists(
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
