begin;
create extension if not exists pgtap with schema extensions;
select plan(31);

set local role postgres;
insert into public.organizations(id,created_by,organization_type,organization_type_code,public_name,status,is_demo) values
 ('21000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','pet_business','pet_business','CP6 Real Partner','active',false),
 ('21000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000004','shelter','shelter','CP6 Real Shelter','active',false),
 ('21000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000006','pet_business','pet_business','CP6 Other Partner','active',false)
on conflict(id) do nothing;
insert into public.organization_memberships(organization_id,user_id,role,status) values
 ('21000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','owner','active'),
 ('21000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000004','owner','active'),
 ('21000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000006','owner','active')
on conflict(organization_id,user_id) do update set role=excluded.role,status=excluded.status;
insert into public.organization_partner_profiles(organization_id,publication_status,public_description,business_model,participation_state,published_at)
values('21000000-0000-0000-0000-000000000001','published','CP6 public profile','online','Basic Partner',now())
on conflict(organization_id) do update set publication_status='published',public_description=excluded.public_description,business_model='online';
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);

create temp table cp6_ids(
  commitment uuid,
  first_offer uuid,
  first_code text,
  first_redemption uuid,
  second_offer uuid,
  second_code text,
  second_redemption uuid,
  evidence uuid,
  evidence_review bigint,
  standing_review bigint,
  demo_commitment uuid,
  demo_offer uuid,
  demo_code text,
  demo_redemption uuid
);
insert into cp6_ids default values;

select is(public.partner_participation_state('21000000-0000-0000-0000-000000000001'),'Participating Partner','published real Partner begins as Participating Partner');
select throws_ok(
  $$update public.organization_partner_profiles set participation_state='Shelter Impact Partner' where organization_id='21000000-0000-0000-0000-000000000001'$$,
  '42501','Partner participation state is server-derived','ordinary Partner cannot self-assign privileged participation state'
);

update cp6_ids set commitment=public.create_partner_contribution_commitment(
  '21000000-0000-0000-0000-000000000001',
  '{"commitment_kind":"fixed_per_redemption","amount_minor":"500","currency_code":"usd","designated_recipient_organization_id":"21000000-0000-0000-0000-000000000002","public_description":"$5 per qualifying redemption"}'::jsonb
);
select ok((select commitment is not null from cp6_ids),'Partner can create provider-agnostic contribution terms');
select is(public.set_partner_contribution_commitment_state((select commitment from cp6_ids),'active','CP6 QA'),'active','Partner can activate its own commitment');

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000006',true);
select is((select count(*) from public.partner_contribution_commitments where id=(select commitment from cp6_ids)),0::bigint,'cross-organization commitment read is blocked by RLS');
select throws_ok(
  format($$select public.set_partner_contribution_commitment_state('%s','paused','unauthorized')$$,(select commitment from cp6_ids)),
  '42501','Not authorized','cross-organization commitment write is rejected'
);

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
update cp6_ids set first_offer=public.create_partner_offer(
 '21000000-0000-0000-0000-000000000001',
 '{"title":"CP6 real redemption one","summary":"QA","terms":"QA terms","redemption_instructions":"Show code","applicability":"online"}'::jsonb
);
select is(public.set_partner_offer_state((select first_offer from cp6_ids),'publish'),'published','first CP6 offer publishes');
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
with c as (select * from public.claim_offer((select first_offer from cp6_ids),null)) update cp6_ids set first_code=c.redeem_code from c;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
update cp6_ids set first_redemption=public.confirm_redemption(
 (select first_code from cp6_ids),null,'{"retail_amount_minor":"2500","paid_amount_minor":"2000","currency_code":"USD"}'::jsonb
);
select ok((select first_redemption is not null from cp6_ids),'non-demo redemption confirms through existing trusted RPC');
select is(public.partner_participation_state('21000000-0000-0000-0000-000000000001'),'Redemption Verified','real confirmed redemption derives Redemption Verified');
select is((select amount_minor from public.donation_intents where redemption_id=(select first_redemption from cp6_ids)),500::bigint,'active fixed commitment accrues exact donation intent amount');
select is(public.public_partner_impact_summary('21000000-0000-0000-0000-000000000001')->>'verified_settlement_count','0','accrued contribution is not presented as settled contribution');

select lives_ok(format($$select public.reverse_redemption('%s','CP6 reversal QA')$$,(select first_redemption from cp6_ids)),'redemption reversal succeeds');
select is((select status from public.donation_intents where redemption_id=(select first_redemption from cp6_ids)),'cancelled','reversal neutralizes the related contribution accrual');
select is((select l.amount_minor from public.economic_event_lines l join public.economic_events e on e.id=l.economic_event_id where e.event_type='reversal' and e.source_type='donation_intent' and e.source_id=(select id from public.donation_intents where redemption_id=(select first_redemption from cp6_ids)) order by l.id desc limit 1),-500::bigint,'accrual reversal is preserved as a negative append-only economic line');
select is(public.partner_participation_state('21000000-0000-0000-0000-000000000001'),'Participating Partner','reversed redemption no longer qualifies reputation');

update cp6_ids set second_offer=public.create_partner_offer(
 '21000000-0000-0000-0000-000000000001',
 '{"title":"CP6 real redemption two","summary":"QA","terms":"QA terms","redemption_instructions":"Show code","applicability":"online"}'::jsonb
);
select is(public.set_partner_offer_state((select second_offer from cp6_ids),'publish'),'published','second CP6 offer publishes');
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
with c as (select * from public.claim_offer((select second_offer from cp6_ids),null)) update cp6_ids set second_code=c.redeem_code from c;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
update cp6_ids set second_redemption=public.confirm_redemption(
 (select second_code from cp6_ids),null,'{"retail_amount_minor":"3000","paid_amount_minor":"2200","currency_code":"USD"}'::jsonb
);
select ok((select second_redemption is not null from cp6_ids),'second real redemption confirms after reversal history');
select is(public.partner_participation_state('21000000-0000-0000-0000-000000000001'),'Redemption Verified','pledge and accrual alone do not award Shelter Impact Partner');

update cp6_ids set evidence=public.submit_partner_contribution_evidence(
 '21000000-0000-0000-0000-000000000001',
 jsonb_build_object(
   'commitment_id',(select commitment from cp6_ids),
   'recipient_organization_id','21000000-0000-0000-0000-000000000002',
   'amount_minor','1000','currency_code','USD','settled_at',(now()-interval '1 day')::text,
   'evidence_reference','cp6-external-receipt-001','evidence_metadata',jsonb_build_object('source','pgTAP')
 )
);
select ok((select evidence is not null from cp6_ids),'Partner can submit external settlement evidence without creating a provider transaction');
select is(public.public_partner_impact_summary('21000000-0000-0000-0000-000000000001')->>'verified_settlement_count','0','submitted evidence remains unverified until privileged review');
select throws_ok(
  format($$select public.review_partner_contribution_evidence('%s','verified','self approval')$$,(select evidence from cp6_ids)),
  '42501','Platform administrator required','Partner cannot verify its own settled-contribution evidence'
);

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000005',true);
update cp6_ids set evidence_review=public.review_partner_contribution_evidence((select evidence from cp6_ids),'verified','External settlement evidence validated for QA');
select ok((select evidence_review is not null from cp6_ids),'platform administrator can append verified evidence review');
set local role postgres;
select ok(exists(select 1 from private.audit_events where action='partner_contribution_evidence.review' and target_id=(select evidence from cp6_ids) and outcome='verified'),'evidence verification is written to private audit history');
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000005',true);
select is(public.partner_participation_state('21000000-0000-0000-0000-000000000001'),'Redemption Verified','verified settlement without good-standing review is still not Shelter Impact Partner');
update cp6_ids set standing_review=public.review_partner_good_standing('21000000-0000-0000-0000-000000000001','good_standing','CP6 QA good-standing review');
select ok((select standing_review is not null from cp6_ids),'platform administrator can append good-standing review');
select is(public.partner_participation_state('21000000-0000-0000-0000-000000000001'),'Shelter Impact Partner','real redemption plus verified settlement plus good standing derives Shelter Impact Partner');
select is(public.public_partner_impact_summary('21000000-0000-0000-0000-000000000001')->>'verified_settlement_count','1','public impact counts only verified settlement evidence');
select is(public.public_partner_impact_summary('21000000-0000-0000-0000-000000000001')->'verified_settlement_amounts'->>'USD','1000','public verified amount is substantiated and currency-scoped');

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
update cp6_ids set demo_commitment=public.create_partner_contribution_commitment(
 '20000000-0000-0000-0000-000000000001',
 '{"commitment_kind":"fixed_per_redemption","amount_minor":"700","currency_code":"USD","designated_recipient_organization_id":"21000000-0000-0000-0000-000000000002"}'::jsonb
);
select is(public.set_partner_contribution_commitment_state((select demo_commitment from cp6_ids),'active','demo exclusion QA'),'active','demo Partner commitment can exist for QA');
update cp6_ids set demo_offer=public.create_partner_offer(
 '20000000-0000-0000-0000-000000000001',
 '{"title":"CP6 demo exclusion","summary":"QA","terms":"QA terms","redemption_instructions":"Show code","applicability":"online"}'::jsonb
);
select is(public.set_partner_offer_state((select demo_offer from cp6_ids),'publish'),'published','demo Partner offer publishes for exclusion test');
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000002',true);
with c as (select * from public.claim_offer((select demo_offer from cp6_ids),null)) update cp6_ids set demo_code=c.redeem_code from c;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
update cp6_ids set demo_redemption=public.confirm_redemption((select demo_code from cp6_ids),null,'{"paid_amount_minor":"1000"}'::jsonb);
select isnt(public.partner_participation_state('20000000-0000-0000-0000-000000000001'),'Redemption Verified','demo organization activity cannot earn real Redemption Verified status');
select is((select count(*) from public.donation_intents where commitment_id=(select demo_commitment from cp6_ids)),0::bigint,'demo organization redemption does not create real contribution accrual');

select * from finish();
rollback;
