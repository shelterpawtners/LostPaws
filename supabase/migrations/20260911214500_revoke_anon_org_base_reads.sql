-- Public organization discovery is exposed through curated SECURITY DEFINER RPCs.
-- Anonymous clients should not read the underlying base tables directly.

revoke select on table public.organizations from anon;
revoke select on table public.organization_locations from anon;

-- Keep the intentional curated public API surface explicit.
grant execute on function public.public_active_offers(uuid) to anon;
grant execute on function public.public_partner_directory(text,text,text,text,text) to anon;
grant execute on function public.public_partner_profile(uuid) to anon;
grant execute on function public.public_partner_profile_details(uuid) to anon;
