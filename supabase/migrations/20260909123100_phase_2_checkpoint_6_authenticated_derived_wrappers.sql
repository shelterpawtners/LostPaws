-- Signed-in callers may query the same derived, permission-safe facts used by
-- the public profile, but the privileged implementation remains private.
grant execute on function private.partner_participation_state(uuid),private.public_partner_impact_summary(uuid) to authenticated;

create function public.partner_participation_state(p_organization_id uuid)
returns text
language sql stable security invoker set search_path='' as $$
  select private.partner_participation_state(p_organization_id)
$$;
create function public.public_partner_impact_summary(p_organization_id uuid)
returns jsonb
language sql stable security invoker set search_path='' as $$
  select private.public_partner_impact_summary(p_organization_id)
$$;

revoke all on function public.partner_participation_state(uuid),public.public_partner_impact_summary(uuid) from public,anon;
grant execute on function public.partner_participation_state(uuid),public.public_partner_impact_summary(uuid) to authenticated;
