-- Pre-cutover launch readiness: keep QA/demo records available for authenticated
-- testing while guaranteeing they never appear on anonymous/public discovery surfaces.

-- Existing QA data is preserved. Only promote offers owned by demo organizations
-- into explicit demo state; never clear an offer that was independently marked demo.
update public.offers f
set is_demo = true
from public.organizations o
where o.id = f.organization_id
  and o.is_demo = true
  and f.is_demo is distinct from true;

-- Any future offer written for a demo organization must inherit demo state.
-- Non-demo organizations may still create explicitly-demo offers, so this trigger
-- only promotes false -> true when the owning organization itself is demo.
create or replace function private.enforce_demo_offer_inheritance()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (
    select 1
    from public.organizations o
    where o.id = new.organization_id
      and o.is_demo = true
  ) then
    new.is_demo := true;
  end if;

  return new;
end
$$;

revoke all on function private.enforce_demo_offer_inheritance() from public, anon, authenticated;

drop trigger if exists enforce_demo_offer_inheritance on public.offers;
create trigger enforce_demo_offer_inheritance
before insert or update of organization_id, is_demo on public.offers
for each row execute function private.enforce_demo_offer_inheritance();

-- Anonymous/public Marketplace discovery excludes both explicitly-demo offers and
-- every offer owned by a demo organization. Authenticated manager/Admin QA access
-- to the underlying records remains unchanged.
create or replace function public.public_active_offers(p_organization_id uuid default null)
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
  eligibility_kind text,
  starts_at timestamptz,
  ends_at timestamptz,
  redemption_instructions text,
  source_url text,
  disclosure text,
  applicability text[]
)
language sql stable security definer set search_path = '' as $$
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

-- Public directory and direct public-profile RPCs must follow the same demo
-- boundary. This prevents a demo record from being reachable by a guessed URL.
create or replace function public.public_partner_directory(
  p_category text default null,
  p_state text default null,
  p_city text default null,
  p_mode text default null,
  p_species text default null
)
returns table(
  organization_id uuid,
  business_name text,
  description text,
  city text,
  state text,
  business_model text,
  participation_state text
)
language sql stable security definer set search_path = '' as $$
  select
    o.id,
    o.public_name,
    p.public_description,
    l.city,
    l.state_province,
    p.business_model,
    private.partner_participation_state(o.id)
  from public.organization_partner_profiles p
  join public.organizations o on o.id = p.organization_id
  left join public.organization_locations l on l.organization_id = o.id and l.is_primary
  where p.publication_status = 'published'
    and o.is_demo = false
    and (p_state is null or lower(l.state_province) = lower(p_state))
    and (p_city is null or lower(l.city) = lower(p_city))
    and (p_mode is null or p.business_model = p_mode)
    and (p_species is null or p_species = any(p.species_served))
    and (
      p_category is null
      or exists (
        select 1
        from public.organization_categories oc
        join public.partner_categories c on c.id = oc.category_id
        where oc.organization_id = o.id
          and lower(c.label) = lower(p_category)
      )
    )
  order by o.public_name
  limit 100
$$;

create or replace function public.public_partner_profile_details(p_organization_id uuid)
returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'business_name', o.public_name,
    'description', p.public_description,
    'about', p.public_about,
    'website_url', o.website_url,
    'public_email', o.public_email,
    'public_phone', o.public_phone,
    'booking_url', p.public_booking_url,
    'order_url', p.public_order_url,
    'service_area', p.public_service_area,
    'business_model', p.business_model,
    'participation_state', private.partner_participation_state(o.id),
    'impact', private.public_partner_impact_summary(o.id),
    'social_links', coalesce((
      select jsonb_agg(jsonb_build_object('platform', s.platform, 'url', s.url, 'label', s.label))
      from public.organization_social_links s
      where s.organization_id = o.id
    ), '[]'::jsonb),
    'locations', coalesce((
      select jsonb_agg(jsonb_build_object('city', l.city, 'state', l.state_province, 'postal', l.postal_code))
      from public.organization_locations l
      where l.organization_id = o.id
    ), '[]'::jsonb),
    'hours', coalesce((
      select jsonb_agg(jsonb_build_object('day', h.day_of_week, 'opens', h.opens_at, 'closes', h.closes_at, 'closed', h.is_closed))
      from public.organization_business_hours h
      where h.organization_id = o.id
    ), '[]'::jsonb)
  )
  from public.organization_partner_profiles p
  join public.organizations o on o.id = p.organization_id
  where p.organization_id = p_organization_id
    and p.publication_status = 'published'
    and o.is_demo = false
$$;
