-- Candidate matching is an authenticated onboarding aid, not a public search
-- endpoint.  Supabase's default anon function grant must be explicitly
-- removed in addition to revoking the PUBLIC pseudo-role.
revoke all on function public.partner_organization_candidates(text, text, text, text, text, text, text) from anon;
revoke all on function public.partner_organization_candidates(text, text, text, text, text, text, text) from public;
grant execute on function public.partner_organization_candidates(text, text, text, text, text, text, text) to authenticated;
