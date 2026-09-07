create or replace function public.public_partner_profile(p_organization_id uuid)
returns table(business_name text, description text, about text, website_url text, public_email text, public_phone text, booking_url text, order_url text, service_area text, business_model text, participation_state text)
language sql stable security definer set search_path='' as $$
 select o.public_name,p.public_description,p.public_about,o.website_url,o.public_email,o.public_phone,p.public_booking_url,p.public_order_url,p.public_service_area,p.business_model,p.participation_state
 from public.organization_partner_profiles p join public.organizations o on o.id=p.organization_id
 where p.organization_id=p_organization_id and p.publication_status='published'
$$;
revoke all on function public.public_partner_profile(uuid) from public,anon;
grant execute on function public.public_partner_profile(uuid) to anon,authenticated;
