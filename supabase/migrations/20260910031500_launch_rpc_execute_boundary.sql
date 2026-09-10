-- Pre-cutover launch readiness: state-changing SECURITY DEFINER RPCs are not
-- anonymous API endpoints. Their internal authorization checks remain in place,
-- but EXECUTE is restricted to signed-in users as an independent boundary.

revoke execute on function public.create_partner_offer(uuid,jsonb) from public, anon;
revoke execute on function public.revise_partner_offer(uuid,jsonb) from public, anon;
revoke execute on function public.set_partner_offer_state(uuid,text) from public, anon;
revoke execute on function public.duplicate_partner_offer(uuid) from public, anon;
revoke execute on function public.claim_offer(uuid,uuid) from public, anon;
revoke execute on function public.validate_redemption_code(text) from public, anon;
revoke execute on function public.confirm_redemption(text,uuid,jsonb) from public, anon;
revoke execute on function public.reverse_redemption(uuid,text) from public, anon;
revoke execute on function public.record_redemption_adjustment(uuid,bigint,bigint,text,jsonb) from public, anon;

grant execute on function public.create_partner_offer(uuid,jsonb) to authenticated;
grant execute on function public.revise_partner_offer(uuid,jsonb) to authenticated;
grant execute on function public.set_partner_offer_state(uuid,text) to authenticated;
grant execute on function public.duplicate_partner_offer(uuid) to authenticated;
grant execute on function public.claim_offer(uuid,uuid) to authenticated;
grant execute on function public.validate_redemption_code(text) to authenticated;
grant execute on function public.confirm_redemption(text,uuid,jsonb) to authenticated;
grant execute on function public.reverse_redemption(uuid,text) to authenticated;
grant execute on function public.record_redemption_adjustment(uuid,bigint,bigint,text,jsonb) to authenticated;

-- Deliberate anonymous read-only discovery endpoints remain public.
grant execute on function public.public_active_offers(uuid) to anon, authenticated;
grant execute on function public.public_partner_directory(text,text,text,text,text) to anon, authenticated;
grant execute on function public.public_partner_profile(uuid) to anon, authenticated;
grant execute on function public.public_partner_profile_details(uuid) to anon, authenticated;
