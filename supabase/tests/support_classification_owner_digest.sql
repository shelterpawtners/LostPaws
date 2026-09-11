begin;
create extension if not exists pgtap with schema extensions;
select plan(8);

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);

select throws_ok(
  $$select count(*)::bigint from private.support_triage_classification$$,
  '42501',
  null,
  'authenticated client cannot read private support classification'
);

select throws_ok(
  $$select count(*)::bigint from private.support_owner_digest$$,
  '42501',
  null,
  'authenticated client cannot read private support owner digest'
);

reset role;

insert into public.support_tickets(
  reporter_id,category,severity,status,subject,description,app_route,created_at
) values
(
  '10000000-0000-0000-0000-000000000003',
  'privacy_safety','p3','new','Privacy concern','Sensitive body','/profile',now()
),
(
  '10000000-0000-0000-0000-000000000003',
  'bug','p0','new','Critical bug','Critical reproduction','/marketplace',now()
),
(
  '10000000-0000-0000-0000-000000000003',
  'marketplace_offer','p1','new','Offer blocked','Offer workflow blocked','/marketplace',now()
),
(
  '10000000-0000-0000-0000-000000000003',
  'suggestion','p3','new','Old suggestion','Product idea','/dashboard',now() - interval '72 hours'
);

select is(
  (
    select classification_bucket
    from private.support_triage_classification
    where category = 'privacy_safety'
    order by created_at desc
    limit 1
  ),
  'owner_immediate',
  'privacy and safety reports route to immediate owner review'
);

select is(
  (
    select notification_lane
    from private.support_triage_classification
    where category = 'bug' and severity = 'p0'
    order by created_at desc
    limit 1
  ),
  'immediate',
  'p0 bugs use the immediate notification lane'
);

select is(
  (
    select classification_bucket
    from private.support_triage_classification
    where category = 'marketplace_offer' and severity = 'p1'
    order by created_at desc
    limit 1
  ),
  'owner_urgent',
  'p1 workflow failures route to urgent owner review'
);

select ok(
  exists (
    select 1
    from private.support_triage_classification
    where category = 'suggestion'
      and classification_bucket = 'product_review'
      and notification_lane = 'daily_digest'
      and recommended_action = 'aging_review'
  ),
  'aging suggestions remain product-review items in the daily digest lane'
);

select ok(
  exists (
    select 1
    from private.support_owner_digest
    where classification_bucket = 'owner_immediate'
      and notification_lane = 'immediate'
      and ticket_count >= 1
  ),
  'owner digest aggregates immediate exception work'
);

select is(
  (
    select count(*)::bigint
    from information_schema.columns
    where table_schema = 'private'
      and table_name in ('support_triage_classification','support_owner_digest')
      and column_name in ('reporter_id','subject','description','body','ai_triage')
  ),
  0::bigint,
  'classification and digest expose no reporter identity, raw text, or AI payload'
);

select ok(
  not exists (
    select 1
    from private.support_triage_classification
    where status in ('resolved','closed')
  ),
  'classification inherits unresolved-only scope from the triage queue'
);

select * from finish();
rollback;
