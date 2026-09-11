begin;
create extension if not exists pgtap with schema extensions;
select plan(7);

set local role anon;
select throws_ok(
  $$select count(*)::bigint from public.support_tickets$$,
  '42501',
  'permission denied for table support_tickets',
  'anonymous callers cannot read support tickets'
);

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);

select lives_ok(
  $$insert into public.support_tickets(reporter_id,category,subject,description)
    values ('10000000-0000-0000-0000-000000000003','bug','Test support issue','A reproducible test report')$$,
  'reporter can create a safe ticket as themselves'
);

select is(
  (select count(*)::bigint from public.support_tickets where reporter_id='10000000-0000-0000-0000-000000000003'),
  1::bigint,
  'reporter can read their own ticket'
);

select throws_ok(
  $$insert into public.support_tickets(reporter_id,category,severity,status,subject,description,human_review_required,ai_triage)
    values ('10000000-0000-0000-0000-000000000003','privacy_safety','p0','triaged','Spoof escalation','Client must not self-escalate',true,'{"decision":"trusted"}'::jsonb)$$,
  '42501',
  null,
  'client cannot self-assign privileged triage state'
);

select lives_ok(
  $q$insert into public.support_ticket_messages(ticket_id,author_id,author_kind,visibility,body)
    select id,'10000000-0000-0000-0000-000000000003','reporter','reporter','Additional reproduction detail'
    from public.support_tickets
    where reporter_id='10000000-0000-0000-0000-000000000003'
    limit 1$q$,
  'reporter can append a reporter-visible message to their own ticket'
);

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000005',true);
select ok(private.is_platform_admin(),'seeded admin is recognized for support triage');
select is(
  (select count(*)::bigint from public.support_tickets where reporter_id='10000000-0000-0000-0000-000000000003'),
  1::bigint,
  'platform admin can read reporter tickets for triage'
);

select * from finish();
rollback;
