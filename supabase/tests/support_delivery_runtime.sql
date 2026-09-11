begin;
create extension if not exists pgtap with schema extensions;
select plan(12);

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);

select throws_ok(
  $$select count(*)::bigint from private.support_delivery_attempts$$,
  '42501', null,
  'authenticated clients cannot read the private delivery ledger'
);
select throws_ok(
  $$select * from public.claim_support_delivery_candidates(1, 60)$$,
  '42501', null,
  'authenticated clients cannot claim delivery candidates'
);
reset role;

insert into public.support_tickets(
  reporter_id,category,severity,status,subject,description,app_route,created_at,human_review_required
) values
(
  '10000000-0000-0000-0000-000000000003',
  'privacy_safety','p0','new','Runtime immediate delivery','Private raw ticket body','/profile',now(),true
),
(
  '10000000-0000-0000-0000-000000000003',
  'suggestion','p3','new','Runtime retry delivery','Private raw ticket body','/dashboard',now() - interval '25 hours',false
);

select ok(
  exists (
    select 1 from public.claim_support_delivery_candidates(1, 60)
    where reference_code = (select reference_code from public.support_tickets where subject = 'Runtime immediate delivery')
      and notification_lane = 'immediate' and human_review_required and escalation_required
  ),
  'claim returns the immediate human-escalation contract only'
);
select is(
  (select count(*)::bigint
    from private.support_delivery_attempts
    where ticket_id = (select id from public.support_tickets where subject = 'Runtime immediate delivery')
      and delivered_at is null
      and lease_expires_at > now()),
  1::bigint, 'an active lease prevents duplicate delivery claims'
);
select ok(
  (with claimed as (
    select * from public.claim_support_delivery_candidates(25, 60)
    where reference_code = (select reference_code from public.support_tickets where subject = 'Runtime retry delivery')
  ) select bool_and(public.complete_support_delivery_candidate(delivery_id, lease_token, false, 'transport_timeout')) from claimed),
  'a safe failed delivery releases its lease for retry'
);
select ok(
  exists (select 1 from public.claim_support_delivery_candidates(25, 60)
    where reference_code = (select reference_code from public.support_tickets where subject = 'Runtime retry delivery')),
  'a failed delivery can be claimed again without creating a second ledger row'
);
select ok(
  (with claimed as (
    select * from public.claim_support_delivery_candidates(25, 60)
    where reference_code = (select reference_code from public.support_tickets where subject = 'Runtime retry delivery')
  ) select bool_and(public.complete_support_delivery_candidate(delivery_id, lease_token, true, null)) from claimed),
  'a successful delivery completes only with its matching lease token'
);
select is(
  (select count(*)::bigint from public.claim_support_delivery_candidates(25, 60)
    where reference_code = (select reference_code from public.support_tickets where subject = 'Runtime retry delivery')),
  0::bigint, 'a completed delivery is never claimed again'
);
select throws_ok(
  $$select * from public.claim_support_delivery_candidates(0, 60)$$,
  '22023', 'p_limit must be between 1 and 50', 'claim batch size is bounded'
);
select throws_ok(
  $$select public.complete_support_delivery_candidate(gen_random_uuid(), gen_random_uuid(), false, 'raw provider response')$$,
  '22023', 'failed delivery requires a safe error code', 'the ledger records only allow-listed operational error codes'
);
select throws_ok(
  $$select public.complete_support_delivery_candidate(gen_random_uuid(), gen_random_uuid(), false, null::text)$$,
  '22023', 'failed delivery requires a safe error code', 'failed deliveries cannot omit their safe operational error code'
);
select is(
  position('subject' in pg_get_function_result('public.claim_support_delivery_candidates(integer,integer)'::regprocedure)),
  0, 'claim interface exposes no raw subject field'
);
select * from finish();
rollback;
