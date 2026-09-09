begin;
create extension if not exists pgtap with schema extensions;
select plan(21);

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
create temp table test_offer_ids(offer_id uuid, version_id uuid, code text, claim_id uuid, redemption_id uuid);
insert into test_offer_ids(offer_id) select public.create_partner_offer('20000000-0000-0000-0000-000000000001',
  '{"title":"Demo grooming welcome","summary":"A clear demo offer.","details":"For local testing only.","terms":"Appointment required. Demo only.","category":"Grooming","eligibility_kind":"all_pets","claim_window_days":"30","availability_limit":"1","per_user_limit":"1","redemption_instructions":"Show the private code at checkout.","disclosure":"Demo Partner-published offer.","applicability":"online"}'::jsonb);
update test_offer_ids t set version_id=o.current_version_id from public.offers o where o.id=t.offer_id;
select is((select count(*) from public.offers where organization_id='20000000-0000-0000-0000-000000000001')::bigint,1::bigint,'Partner can create an offer');
select is((select claim_window_days from public.offer_versions where id=(select version_id from test_offer_ids)),30,'claim window defaults to 30 days');
select is((select eligibility_kind from public.offer_versions where id=(select version_id from test_offer_ids)),'all_pets','all-pet eligibility is explicit');
select is((select applicability from public.offer_locations where offer_version_id=(select version_id from test_offer_ids)),'online','online applicability is preserved');
select lives_ok($$select public.create_partner_offer('20000000-0000-0000-0000-000000000001','{"title":"Second","summary":"Second simultaneous offer"}'::jsonb)$$,'multiple offers per organization work');

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000006',true);
select throws_ok(format($$select public.revise_partner_offer('%s','{"title":"Attack","summary":"Cross organization"}'::jsonb)$$,(select offer_id from test_offer_ids)),'42501',null,'Partner B cannot edit Partner A offer');

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
select is(public.set_partner_offer_state((select offer_id from test_offer_ids),'publish'),'published','complete offer publishes');
select is((select count(*) from public.public_active_offers(null) where offer_id=(select offer_id from test_offer_ids))::bigint,1::bigint,'published current offer is public');
select public.revise_partner_offer((select offer_id from test_offer_ids),'{"title":"Demo grooming welcome v2","summary":"New immutable terms.","terms":"New terms remain traceable.","eligibility_kind":"shelter_pet_enhanced","starts_at":"2099-01-01T00:00:00Z","claim_window_days":"14","redemption_instructions":"Show code.","applicability":"all_organization_locations"}'::jsonb);
select is((select title from public.offer_versions where id=(select version_id from test_offer_ids)),'Demo grooming welcome','published historical version remains unchanged');
select is((select count(*) from public.offer_versions where offer_id=(select offer_id from test_offer_ids))::bigint,2::bigint,'material edit creates a new version');
select is(public.set_partner_offer_state((select offer_id from test_offer_ids),'publish'),'scheduled','future offer is scheduled');
select is((select count(*) from public.public_active_offers(null) where offer_id=(select offer_id from test_offer_ids))::bigint,0::bigint,'scheduled offer is excluded from active public results');
select isnt(public.duplicate_partner_offer((select offer_id from test_offer_ids)),(select offer_id from test_offer_ids),'duplicate creates a distinct draft offer');
select throws_ok($$select public.create_partner_offer('20000000-0000-0000-0000-000000000001','{"title":"Bad dates","summary":"Invalid","starts_at":"2030-02-02T00:00:00Z","ends_at":"2030-01-01T00:00:00Z"}'::jsonb)$$,'23514',null,'invalid date range is rejected');

-- Restore the first exact version as current to exercise claim/redemption.
reset role;
update public.offers set current_version_id=(select version_id from test_offer_ids),status='active' where id=(select offer_id from test_offer_ids);
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
with c as (select * from public.claim_offer((select offer_id from test_offer_ids),null)) update test_offer_ids t set claim_id=c.claim_id,code=c.redeem_code from c;
select is((select status from public.offer_claims where id=(select claim_id from test_offer_ids)),'claimed','claim is distinct from utilization');
select throws_ok(format($$select * from public.claim_offer('%s',null)$$,(select offer_id from test_offer_ids)),'P0001',null,'finite inventory cannot oversubscribe');

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000006',true);
select is((select count(*) from public.validate_redemption_code((select code from test_offer_ids)))::bigint,0::bigint,'cross-Partner code validation reveals nothing');
select throws_ok(format($$select public.confirm_redemption('%s',null)$$,(select code from test_offer_ids)),'42501',null,'cross-Partner redemption is denied');

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
update test_offer_ids set redemption_id=public.confirm_redemption(code,null);
select is((select status from public.offer_claims where id=(select claim_id from test_offer_ids)),'utilized','confirmation marks the claim utilized');
select throws_ok(format($$select public.confirm_redemption('%s',null)$$,(select code from test_offer_ids)),'P0001',null,'opaque code replay is rejected');
select lives_ok(format($$select public.reverse_redemption('%s','Partner correction')$$,(select redemption_id from test_offer_ids)),'reversal is append-audited');

select * from finish();
rollback;
