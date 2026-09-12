-- Track 2: real dual-marketplace audience filtering.
--
-- public_active_offers already existed but never returned or filtered by
-- offers.channel — /marketplace?channel=rave only changed page theming, not
-- the actual offer list. This closes that gap per plan section 6's filtering
-- contract, using the existing market_channel enum ('pet','rave','shared'):
--   Pet Offers  -> channel in ('pet','shared')
--   RAVE Offers -> channel in ('rave','shared')
--   Show Everything -> no channel filter (p_channel null), same as the
--   function's pre-existing default behavior, so existing callers that only
--   pass p_organization_id are unaffected.

drop function if exists public.public_active_offers(uuid);

create function public.public_active_offers(
  p_organization_id uuid default null,
  p_channel public.market_channel default null
)
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
  channel public.market_channel,
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
    o.channel,
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
    and (p_channel is null or o.channel = p_channel or o.channel = 'shared')
$$;

revoke all on function public.public_active_offers(uuid, public.market_channel) from public;
grant execute on function public.public_active_offers(uuid, public.market_channel) to anon, authenticated;
