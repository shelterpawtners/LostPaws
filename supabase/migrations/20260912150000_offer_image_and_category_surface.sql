-- Marketplace tiles need a real photo and a real category tag.
--
-- Two gaps this closes:
--   1. offers has a category column, but public_active_offers never returned
--      it, so tiles showed a decorative tag icon with no tag content.
--   2. There was nowhere to store an offer image, so every tile fell back to
--      the same monogram panel and the marketplace looked unpopulated.
--
-- image_url is a plain text URL rather than uploaded storage on purpose: a
-- vendor supplies a link to their own offer page and the link-preview helper
-- proposes the image from that page's Open Graph metadata. The vendor confirms
-- it before publishing, so we never assert rights over an image we fetched.
-- See docs/product/OFFER-LINK-PREVIEW-PROPOSAL.md.

alter table public.offers
  add column if not exists image_url text,
  add column if not exists image_source_url text,
  add column if not exists image_confirmed_by uuid references public.profiles,
  add column if not exists image_confirmed_at timestamptz;

comment on column public.offers.image_url is
  'Primary tile image. Set only after a vendor confirms they may use it.';
comment on column public.offers.image_source_url is
  'Page the image was proposed from, kept for provenance.';
comment on column public.offers.image_confirmed_by is
  'Who confirmed rights to use the image. Null means unconfirmed: do not publish.';

drop function if exists public.public_active_offers(uuid, public.market_channel);

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
  category text,
  image_url text,
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
    o.category,
    -- Only surface an image a vendor has confirmed they may use.
    case when o.image_confirmed_at is not null then o.image_url else null end,
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
