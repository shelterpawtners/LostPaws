begin;
create extension if not exists pgtap with schema extensions;
select plan(6);

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);

select throws_ok(
  $$select count(*)::bigint from private.support_triage_queue$$,
  '42501',
  null,
  'authenticated client cannot read the private support triage queue'
);

reset role;

insert into public.support_tickets(
  reporter_id,category,severity,status,subject,description,app_route,created_at
) values
(
  '10000000-0000-0000-0000-000000000003',
  'privacy_safety','p3','new','Privacy concern','Sensitive report body stays private','/profile',now()
),
(
  '10000000-0000-0000-0000-000000000003',
  'bug','p2','new','Repeated marketplace failure','First reproduction','/marketplace',now()
),
(
  '10000000-0000-0000-0000-000000000003',
  'bug','p2','investigating','  REPEATED   MARKETPLACE FAILURE ','Second reproduction','/marketplace',now()
),
(
  '10000000-0000-0000-0000-000000000003',
  'suggestion','p3','new','Old suggestion','Still waiting for review','/dashboard',now() - interval '72 hours'
);

select is(
  (
    select recommended_action
    from private.support_triage_queue
    where category = 'privacy_safety'
    order by created_at desc
    limit 1
  ),
  'human_escalation',
  'privacy and safety reports are always recommended for human escalation'
);

select ok(
  exists (
    select 1
    from private.support_triage_queue
    where category = 'bug'
      and app_route = '/marketplace'
      and duplicate_candidate_count >= 2
      and recommended_action = 'duplicate_review'
  ),
  'duplicate evidence produces advisory duplicate review without closing tickets'
);

select ok(
  exists (
    select 1
    from private.support_triage_queue
    where category = 'suggestion'
      and recommended_action = 'aging_review'
  ),
  'older unresolved tickets are surfaced for aging review'
);

select is(
  (
    select count(*)::bigint
    from information_schema.columns
    where table_schema = 'private'
      and table_name = 'support_triage_queue'
      and column_name in ('reporter_id','subject','description','body','ai_triage')
  ),
  0::bigint,
  'triage queue exposes no reporter identity, raw ticket text, or AI payload'
);

select ok(
  not exists (
    select 1
    from private.support_triage_queue
    where status in ('resolved','closed')
  ),
  'triage queue is restricted to unresolved work'
);

select * from finish();
rollback;
