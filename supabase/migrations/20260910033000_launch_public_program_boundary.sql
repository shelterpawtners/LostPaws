-- Launch boundary for third-party public adoption benefits.
-- Public programs/community resources remain browseable by anonymous users but are
-- never represented as ShelterPawtners-managed claims or redemptions.

-- Extend the public read model with the launch-content fields already stored on
-- public.offers so the Marketplace can show the official destination, eligibility,
-- and last verification date without exposing private organization data.
drop function if exists public.public_active_offers(uuid);

create function public.public_active_offers(p_organization_id uuid default null)
returns table(
  offer_id uuid,
  organization_id uuid,
  business_name text,
  version_id uuid,
  title text,
  summary text,
  details text,
  terms text,
  classification text,
  destination_url text,
  eligibility text,
  last_verified_at timestamptz,
  eligibility_kind text,
  starts_at timestamptz,
  ends_at timestamptz,
  redemption_instructions text,
  source_url text,
  disclosure text,
  applicability text[]
)
language sql
stable
security definer
set search_path=''
as $$
  select
    o.id,
    o.organization_id,
    g.public_name,
    v.id,
    v.title,
    v.summary,
    v.details,
    v.terms,
    o.classification,
    o.destination_url,
    o.eligibility,
    o.last_verified_at,
    v.eligibility_kind,
    v.starts_at,
    v.ends_at,
    v.redemption_instructions,
    v.source_url,
    v.disclosure,
    array(
      select ol.applicability
      from public.offer_locations ol
      where ol.offer_version_id = v.id
      order by ol.applicability
    )
  from public.offers o
  join public.offer_versions v on v.id = o.current_version_id
  join public.organizations g on g.id = o.organization_id
  where o.status = 'active'
    and v.status = 'published'
    and (v.starts_at is null or v.starts_at <= now())
    and (v.ends_at is null or v.ends_at > now())
    and o.classification not in ('internal', 'reference')
    and o.is_demo = false
    and g.is_demo = false
    and (p_organization_id is null or o.organization_id = p_organization_id)
$$;

revoke all on function public.public_active_offers(uuid) from public;
grant execute on function public.public_active_offers(uuid) to anon, authenticated;

-- Keep the existing claim engine intact for ShelterPawtners-managed offers, but
-- make external public/community resources explicitly non-claimable at the
-- authoritative database boundary.
create or replace function public.claim_offer(p_offer_id uuid,p_pet_id uuid default null)
returns table(claim_id uuid,redeem_code text,expires_at timestamptz)
language plpgsql
security definer
set search_path=''
as $$
declare
  o public.offers;
  v public.offer_versions;
  c uuid:=gen_random_uuid();
  t uuid:=gen_random_uuid();
  raw text:=replace(gen_random_uuid()::text,'-','')||replace(gen_random_uuid()::text,'-','');
  exp timestamptz;
  used integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode='42501';
  end if;

  select * into o from public.offers where id=p_offer_id for update;
  if o.id is null then
    raise exception 'Offer is not claimable';
  end if;

  if o.classification in ('public_program','community') then
    raise exception 'Public programs and community resources are accessed through their official source';
  end if;

  select * into v from public.offer_versions where id=o.current_version_id for update;
  if o.status<>'active'
     or v.status<>'published'
     or (v.starts_at is not null and v.starts_at>now())
     or (v.ends_at is not null and v.ends_at<=now()) then
    raise exception 'Offer is not claimable';
  end if;

  if p_pet_id is not null and not exists(
    select 1
    from public.guardianships g
    where g.pet_id=p_pet_id
      and g.guardian_id=auth.uid()
      and g.status='active'
  ) then
    raise exception 'Pet is not under your guardianship' using errcode='42501';
  end if;

  select count(*) into used
  from public.offer_claims
  where offer_version_id=v.id and status in ('claimed','reserved','utilized');

  if v.availability_limit is not null and used>=v.availability_limit then
    raise exception 'Offer inventory is no longer available';
  end if;

  if v.per_user_limit is not null and (
    select count(*)
    from public.offer_claims
    where offer_version_id=v.id
      and guardian_id=auth.uid()
      and status<>'cancelled'
  )>=v.per_user_limit then
    raise exception 'Per-user claim limit reached';
  end if;

  if p_pet_id is not null and v.per_pet_limit is not null and (
    select count(*)
    from public.offer_claims
    where offer_version_id=v.id
      and pet_id=p_pet_id
      and status<>'cancelled'
  )>=v.per_pet_limit then
    raise exception 'Per-pet claim limit reached';
  end if;

  exp:=least(now()+make_interval(days=>v.claim_window_days),coalesce(v.ends_at,'infinity'));

  insert into private.secure_tokens(
    id,purpose,token_digest,target_type,target_id,expires_at,created_by
  ) values(
    t,'guardian_redemption',encode(extensions.digest(raw,'sha256'),'hex'),
    'offer_claim',c,exp,auth.uid()
  );

  insert into public.offer_claims(
    id,offer_id,offer_version_id,guardian_id,pet_id,status,expires_at,token_id
  ) values(
    c,o.id,v.id,auth.uid(),p_pet_id,'claimed',exp,t
  );

  insert into private.audit_events(actor_id,action,target_type,target_id,outcome)
  values(auth.uid(),'offer.claim','offer_claim',c,'success');

  return query select c,raw,exp;
end
$$;

revoke execute on function public.claim_offer(uuid,uuid) from public, anon;
grant execute on function public.claim_offer(uuid,uuid) to authenticated;
