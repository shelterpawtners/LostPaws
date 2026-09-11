begin;
create extension if not exists pgtap with schema extensions;
select plan(11);

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);

select throws_ok(
  $$select count(*)::bigint from private.support_delivery_candidates$$,
  '42501',
  null,
  'authenticated client cannot read private support delivery candidates'
);

reset role;

insert into public.support_tickets(
  reporter_id,category,severity,status,subject,description,app_route,created_at,human_review_required
) values
(
  '10000000-0000-0000-0000-000000000003',
  'privacy_safety','p3','new','Privacy concern','Sensitive body','/profile',now(),true
),
(
  '10000000-0000-0000-0000-000000000003',
  'suggestion','p3','new','Yesterday suggestion','Product idea','/dashboard',now() - interval '25 hours',false
),
(
  '10000000-0000-0000-0000-000000000003',
  'bug','p2','new','Aging bug','Reproduction steps','/marketplace',now() - interval '49 hours',false
),
(
  '10000000-0000-0000-0000-000000000003',
  'ui_accessibility','p3','new','Old accessibility note','UI description','/dashboard',now() - interval '8 days',false
),
(
  '10000000-0000-0000-0000-000000000003',
  'bug','p2','resolved','Resolved bug','Resolved reproduction','/marketplace',now() - interval '9 days',false
);

select ok(
  exists (
    select 1
    from private.support_delivery_candidates
    where category = 'privacy_safety'
      and notification_lane = 'immediate'
      and is_due
      and escalation_required
  ),
  'privacy and safety work is immediately due and human escalated'
);

select ok(
  exists (
    select 1
    from private.support_delivery_candidates
    where category = 'suggestion'
      and notification_lane = 'daily_digest'
      and is_due
      and aging_band = 'carried_over_24h_plus'
  ),
  'daily digest work carries across calendar days instead of resetting'
);

select ok(
  exists (
    select 1
    from private.support_delivery_candidates
    where category = 'bug'
      and severity = 'p2'
      and aging_band = 'aging_48h_plus'
      and escalation_required
      and age_days >= 2
  ),
  'unresolved work crossing 48 hours escalates persistently'
);

select ok(
  exists (
    select 1
    from private.support_delivery_candidates
    where category = 'ui_accessibility'
      and aging_band = 'stale_7d_plus'
      and escalation_required
      and age_days >= 7
  ),
  'week-old unresolved work remains visible as stale and escalated'
);

select ok(
  not exists (
    select 1
    from private.support_delivery_candidates
    where status in ('resolved','closed')
  ),
  'delivery candidates inherit unresolved-only scope'
);

select is(
  (
    select count(*)::bigint
    from information_schema.columns
    where table_schema = 'private'
      and table_name = 'support_delivery_candidates'
      and column_name in ('reporter_id','subject','description','body','ai_triage')
  ),
  0::bigint,
  'delivery contract exposes no reporter identity, raw text, or AI payload'
);

select ok(
  exists (
    select 1
    from private.support_delivery_candidates
    where notification_lane = 'daily_digest'
      and first_due_at > created_at
  ),
  'daily digest candidates have an explicit future first-due boundary'
);

select ok(
  not has_table_privilege('anon','private.support_delivery_candidates','select'),
  'anon has no SELECT privilege on private delivery candidates'
);

select ok(
  not has_table_privilege('authenticated','private.support_delivery_candidates','select'),
  'authenticated has no SELECT privilege on private delivery candidates'
);

select is(
  (
    select count(*)::bigint
    from private.support_delivery_candidates
    where category in ('privacy_safety','suggestion','bug','ui_accessibility')
  ),
  4::bigint,
  'only the four unresolved seeded tickets appear in the delivery contract'
);

select * from finish();
rollback;
