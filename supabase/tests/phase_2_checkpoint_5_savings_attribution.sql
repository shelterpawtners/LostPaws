begin;
create extension if not exists pgtap with schema extensions;
select plan(12);

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);

create temp table cp5_ids(
  first_offer uuid,
  first_code text,
  first_redemption uuid,
  second_offer uuid,
  second_code text,
  second_redemption uuid,
  adjustment_event bigint
);
insert into cp5_ids default values;

update cp5_ids set first_offer=public.create_partner_offer(
  '20000000-0000-0000-0000-000000000001',
  '{"title":"CP5 first-known demo path","summary":"QA-only attribution coverage.","terms":"QA only.","redemption_instructions":"Show code.","applicability":"online"}'::jsonb
);
select is(public.set_partner_offer_state((select first_offer from cp5_ids),'publish'),'published','first CP5 offer publishes');

update cp5_ids set second_offer=public.create_partner_offer(
  '20000000-0000-0000-0000-000000000001',
  '{"title":"CP5 returning demo path","summary":"QA-only relationship coverage.","terms":"QA only.","redemption_instructions":"Show code.","applicability":"online"}'::jsonb
);
select is(public.set_partner_offer_state((select second_offer from cp5_ids),'publish'),'published','second CP5 offer publishes');

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
with c as (select * from public.claim_offer((select first_offer from cp5_ids),null))
update cp5_ids set first_code=c.redeem_code from c;
with c as (select * from public.claim_offer((select second_offer from cp5_ids),null))
update cp5_ids set second_code=c.redeem_code from c;

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
update cp5_ids set first_redemption=public.confirm_redemption(
  first_code,
  null,
  '{"retail_amount_minor":"2500","paid_amount_minor":"1800","currency_code":"usd","reference_value_kind":"retail_price","reference_value_source":"receipt","evidence_reference":"qa-receipt-001","evidence_metadata":{"source":"pgTAP"},"partner_customer_attestation":"new_to_business"}'::jsonb
);

select is((select retail_amount_minor from public.redemptions where id=(select first_redemption from cp5_ids)),2500::bigint,'reference amount is stored in integer minor units');
select is((select paid_amount_minor from public.redemptions where id=(select first_redemption from cp5_ids)),1800::bigint,'paid amount is stored in integer minor units');
select is((select candidate_savings_minor from public.redemptions where id=(select first_redemption from cp5_ids)),700::bigint,'candidate savings uses exact non-negative integer math');
select is((select currency_code::text from public.redemptions where id=(select first_redemption from cp5_ids)),'USD','currency is normalized to uppercase');
select is((select reference_value_source from public.redemptions where id=(select first_redemption from cp5_ids)),'receipt','reference provenance is preserved');
select is((select partner_customer_attestation from public.redemptions where id=(select first_redemption from cp5_ids)),'new_to_business','Partner customer attestation is stored separately');
select is((select shelterpawtners_relationship from public.redemptions where id=(select first_redemption from cp5_ids)),'first_known','first non-demo confirmed Partner relationship is first-known');

update cp5_ids set second_redemption=public.confirm_redemption(
  second_code,
  null,
  '{"retail_amount_minor":"1000","paid_amount_minor":"1200","partner_customer_attestation":"existing_customer"}'::jsonb
);
select is((select candidate_savings_minor from public.redemptions where id=(select second_redemption from cp5_ids)),0::bigint,'candidate savings never becomes negative');
select is((select shelterpawtners_relationship from public.redemptions where id=(select second_redemption from cp5_ids)),'returning','later non-demo confirmed redemption is returning');

update cp5_ids set adjustment_event=public.record_redemption_adjustment(
  first_redemption,
  100,
  0,
  'QA correction',
  '{"source":"pgTAP"}'::jsonb
);
select is((select retail_amount_minor from public.redemptions where id=(select first_redemption from cp5_ids)),2500::bigint,'adjustment does not rewrite original captured amount');
select is((select retail_amount_delta_minor from public.redemption_events where id=(select adjustment_event from cp5_ids)),100::bigint,'adjustment is preserved as an append-only delta event');

select lives_ok(format($$select public.reverse_redemption('%s','CP5 reversal QA')$$,(select first_redemption from cp5_ids)),'existing reversal remains append-audited after CP5 extension');

select * from finish();
rollback;
