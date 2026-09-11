begin;
create extension if not exists pgtap with schema extensions;
select plan(7);

select is(
  private.support_ticket_fingerprint('bug','/dashboard','  Save   fails '),
  private.support_ticket_fingerprint('BUG','/dashboard','save fails'),
  'support fingerprint normalizes case and repeated whitespace'
);

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);

select throws_ok(
  $$insert into public.support_tickets(
      reporter_id,category,subject,description,duplicate_group_key
    ) values (
      '10000000-0000-0000-0000-000000000003',
      'bug',
      'Client supplied duplicate group',
      'A reporter must not control internal duplicate grouping.',
      'client-controlled-group'
    )$$,
  '42501',
  null,
  'reporter cannot self-assign an internal duplicate group'
);

select throws_ok(
  $$select count(*)::bigint from private.support_duplicate_candidates$$,
  '42501',
  null,
  'authenticated client cannot read the private duplicate queue'
);

select throws_ok(
  $$select count(*)::bigint from private.support_daily_digest$$,
  '42501',
  null,
  'authenticated client cannot read the private daily digest'
);

reset role;

insert into public.support_tickets(
  reporter_id,category,severity,status,subject,description,app_route
) values
(
  '10000000-0000-0000-0000-000000000003',
  'bug','p2','investigating','Checkout button fails','First reproduction','/marketplace'
),
(
  '10000000-0000-0000-0000-000000000003',
  'bug','p2','new','  CHECKOUT   BUTTON FAILS ','Second reproduction','/marketplace'
);

select is(
  (
    select ticket_count
    from private.support_duplicate_candidates
    where fingerprint = private.support_ticket_fingerprint(
      'bug','/marketplace','checkout button fails'
    )
  ),
  2::bigint,
  'duplicate queue groups exact normalized support fingerprints without raw reporter data'
);

select ok(
  exists (
    select 1
    from private.support_daily_digest
    where category = 'bug'
      and severity = 'p2'
      and status in ('new','investigating')
      and ticket_count >= 1
  ),
  'daily digest exposes aggregate support counts'
);

select is(
  (
    select count(*)::bigint
    from information_schema.columns
    where table_schema = 'private'
      and table_name in ('support_duplicate_candidates','support_daily_digest')
      and column_name in ('reporter_id','subject','description','body')
  ),
  0::bigint,
  'private triage views expose no raw reporter identity or ticket text columns'
);

select * from finish();
rollback;
