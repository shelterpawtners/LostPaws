-- Phase 2 Checkpoint 6: keep privileged implementation in the unexposed private
-- schema and expose only SECURITY INVOKER RPC wrappers. This avoids expanding
-- the existing public SECURITY DEFINER advisory surface.

alter function public.create_partner_contribution_commitment(uuid,jsonb) set schema private;
alter function public.set_partner_contribution_commitment_state(uuid,text,text) set schema private;
alter function public.submit_partner_contribution_evidence(uuid,jsonb) set schema private;
alter function public.review_partner_contribution_evidence(uuid,text,text) set schema private;
alter function public.review_partner_good_standing(uuid,text,text) set schema private;
alter function public.partner_impact_summary(uuid) set schema private;
alter function public.partner_participation_state(uuid) set schema private;
alter function public.public_partner_impact_summary(uuid) set schema private;

-- Raw derived reputation/public-impact helpers are intentionally not directly
-- exposed as Data API RPCs. Existing public directory/profile RPCs call them as
-- trusted implementation details.
revoke all on function private.partner_participation_state(uuid) from public,anon,authenticated;
revoke all on function private.public_partner_impact_summary(uuid) from public,anon,authenticated;

-- Authenticated callers may invoke these private helpers only through the public
-- invoker wrappers below. The private SECURITY DEFINER functions retain all of
-- their explicit auth.uid()/organization/platform-admin checks.
grant execute on function private.create_partner_contribution_commitment(uuid,jsonb) to authenticated;
grant execute on function private.set_partner_contribution_commitment_state(uuid,text,text) to authenticated;
grant execute on function private.submit_partner_contribution_evidence(uuid,jsonb) to authenticated;
grant execute on function private.review_partner_contribution_evidence(uuid,text,text) to authenticated;
grant execute on function private.review_partner_good_standing(uuid,text,text) to authenticated;
grant execute on function private.partner_impact_summary(uuid) to authenticated;

create function public.create_partner_contribution_commitment(p_organization_id uuid,p_terms jsonb)
returns uuid
language sql security invoker set search_path='' as $$
  select private.create_partner_contribution_commitment(p_organization_id,p_terms)
$$;
create function public.set_partner_contribution_commitment_state(p_commitment_id uuid,p_state text,p_reason text default null)
returns text
language sql security invoker set search_path='' as $$
  select private.set_partner_contribution_commitment_state(p_commitment_id,p_state,p_reason)
$$;
create function public.submit_partner_contribution_evidence(p_organization_id uuid,p_evidence jsonb)
returns uuid
language sql security invoker set search_path='' as $$
  select private.submit_partner_contribution_evidence(p_organization_id,p_evidence)
$$;
create function public.review_partner_contribution_evidence(p_evidence_id uuid,p_action text,p_reason text)
returns bigint
language sql security invoker set search_path='' as $$
  select private.review_partner_contribution_evidence(p_evidence_id,p_action,p_reason)
$$;
create function public.review_partner_good_standing(p_organization_id uuid,p_state text,p_reason text)
returns bigint
language sql security invoker set search_path='' as $$
  select private.review_partner_good_standing(p_organization_id,p_state,p_reason)
$$;
create function public.partner_impact_summary(p_organization_id uuid)
returns jsonb
language sql stable security invoker set search_path='' as $$
  select private.partner_impact_summary(p_organization_id)
$$;

revoke all on function public.create_partner_contribution_commitment(uuid,jsonb),
  public.set_partner_contribution_commitment_state(uuid,text,text),
  public.submit_partner_contribution_evidence(uuid,jsonb),
  public.review_partner_contribution_evidence(uuid,text,text),
  public.review_partner_good_standing(uuid,text,text),
  public.partner_impact_summary(uuid) from public,anon;
grant execute on function public.create_partner_contribution_commitment(uuid,jsonb),
  public.set_partner_contribution_commitment_state(uuid,text,text),
  public.submit_partner_contribution_evidence(uuid,jsonb),
  public.review_partner_contribution_evidence(uuid,text,text),
  public.review_partner_good_standing(uuid,text,text),
  public.partner_impact_summary(uuid) to authenticated;

-- Rebind the public directory/profile endpoints to the private derived helpers.
-- These endpoints already existed before CP6; CP6 does not add a new public
-- SECURITY DEFINER endpoint for raw financial/reputation facts.
create or replace function public.public_partner_directory(p_category text default null,p_state text default null,p_city text default null,p_mode text default null,p_species text default null)
returns table(organization_id uuid,business_name text,description text,city text,state text,business_model text,participation_state text)
language sql stable security definer set search_path='' as $$
  select o.id,o.public_name,p.public_description,l.city,l.state_province,p.business_model,private.partner_participation_state(o.id)
  from public.organization_partner_profiles p join public.organizations o on o.id=p.organization_id
  left join public.organization_locations l on l.organization_id=o.id and l.is_primary
  where p.publication_status='published'
    and (p_state is null or lower(l.state_province)=lower(p_state))
    and (p_city is null or lower(l.city)=lower(p_city))
    and (p_mode is null or p.business_model=p_mode)
    and (p_species is null or p_species=any(p.species_served))
    and (p_category is null or exists(
      select 1 from public.organization_categories oc join public.partner_categories c on c.id=oc.category_id
      where oc.organization_id=o.id and lower(c.label)=lower(p_category)
    ))
  order by o.public_name limit 100
$$;

create or replace function public.public_partner_profile_details(p_organization_id uuid)
returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object(
  'business_name',o.public_name,'description',p.public_description,'about',p.public_about,
  'website_url',o.website_url,'public_email',o.public_email,'public_phone',o.public_phone,
  'booking_url',p.public_booking_url,'order_url',p.public_order_url,'service_area',p.public_service_area,
  'business_model',p.business_model,'participation_state',private.partner_participation_state(o.id),
  'impact',private.public_partner_impact_summary(o.id),
  'social_links',coalesce((select jsonb_agg(jsonb_build_object('platform',s.platform,'url',s.url,'label',s.label)) from public.organization_social_links s where s.organization_id=o.id),'[]'::jsonb),
  'locations',coalesce((select jsonb_agg(jsonb_build_object('city',l.city,'state',l.state_province,'postal',l.postal_code)) from public.organization_locations l where l.organization_id=o.id),'[]'::jsonb),
  'hours',coalesce((select jsonb_agg(jsonb_build_object('day',h.day_of_week,'opens',h.opens_at,'closes',h.closes_at,'closed',h.is_closed)) from public.organization_business_hours h where h.organization_id=o.id),'[]'::jsonb)
 ) from public.organization_partner_profiles p join public.organizations o on o.id=p.organization_id
 where p.organization_id=p_organization_id and p.publication_status='published'
$$;

revoke all on function public.public_partner_directory(text,text,text,text,text),public.public_partner_profile_details(uuid) from public;
grant execute on function public.public_partner_directory(text,text,text,text,text),public.public_partner_profile_details(uuid) to anon,authenticated;
