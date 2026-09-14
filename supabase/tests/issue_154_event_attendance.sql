begin;
create extension if not exists pgtap with schema extensions;
select plan(14);

-- Fixed ids scoped to this file (41000000-... prefix) to avoid colliding with
-- track2_events_foundation.sql's own self-contained event fixtures, since
-- each pgTAP file runs in its own begin/rollback transaction.

-- Org A (20000000-...0001, owned by user 10000000-...0003) creates and
-- publishes a pet-audience event for this test.
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
insert into public.events(id,organization_id,created_by,audience,category,title,summary,status,published_at)
values ('41000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','pet','Adoption Event','Issue 154 QA Adoption Day','A demo adoption event.','active',now());
insert into public.event_participants(event_id,organization_id,role,created_by)
values ('41000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','vending','10000000-0000-0000-0000-000000000003');

-- Guardian A (10000000-...0001) marks themselves attending.
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
select lives_ok(
  $$insert into public.event_attendees(event_id,user_id) values ('41000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001')$$,
  'a guardian can mark themselves attending'
);
select throws_ok(
  $$insert into public.event_attendees(event_id,user_id) values ('41000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000002')$$,
  '42501',null,
  'a guardian cannot mark a different user as attending'
);
select is(
  (select public.event_attendance_count('41000000-0000-0000-0000-000000000001')),
  1::bigint,
  'attendance count reflects the one attending row'
);

-- Guardian B (10000000-...0002) cannot see Guardian A's attendance row.
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000002',true);
select is(
  (select count(*) from public.event_attendees where event_id='41000000-0000-0000-0000-000000000001')::bigint,
  0::bigint,
  'another user cannot read someone else''s attendance row (no public attendee directory)'
);
select is(
  (select public.event_attendance_count('41000000-0000-0000-0000-000000000001')),
  1::bigint,
  'the aggregate count is still visible to another authenticated user'
);

-- Guardian A can see and toggle their own row, but not delete it (no delete grant).
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
select is(
  (select status from public.event_attendees where event_id='41000000-0000-0000-0000-000000000001' and user_id='10000000-0000-0000-0000-000000000001'),
  'attending',
  'a guardian can read their own attendance row'
);
select lives_ok(
  $$update public.event_attendees set status='not_attending' where event_id='41000000-0000-0000-0000-000000000001' and user_id='10000000-0000-0000-0000-000000000001'$$,
  'a guardian can toggle their own attendance off'
);
select is(
  (select public.event_attendance_count('41000000-0000-0000-0000-000000000001')),
  0::bigint,
  'attendance count drops once the guardian toggles off'
);

-- anon can still call the aggregate count function on a public event.
select set_config('request.jwt.claim.sub','',true);
set local role anon;
select is(
  (select public.event_attendance_count('41000000-0000-0000-0000-000000000001')),
  0::bigint,
  'anon can call the public attendance count function'
);
select is(
  (select count(*) from public.event_participant_organizations('41000000-0000-0000-0000-000000000001')),
  1::bigint,
  'anon can see the one vending organization for this public event via the safe contact function'
);
select is(
  (select role from public.event_participant_organizations('41000000-0000-0000-0000-000000000001') limit 1),
  'vending',
  'the participant organization function reports the correct role'
);

-- Event-linked offers: an offer created for this event is only returned by
-- public_active_offers when that event is requested.
-- public_active_offers deliberately excludes offers from is_demo
-- organizations (seed org 20000000-...0001 is one), so flip that flag for
-- this org within this rolled-back transaction only — otherwise a real,
-- non-demo offer would still be correctly hidden and the assertions below
-- would fail for a reason unrelated to event filtering.
reset role;
update public.organizations set is_demo=false where id='20000000-0000-0000-0000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
select public.create_partner_offer(
  '20000000-0000-0000-0000-000000000001',
  jsonb_build_object(
    'title','Issue 154 QA Event Offer','summary','Booth-only discount.',
    'terms','Show this at the booth.','redemption_instructions','Show at booth.',
    'category','General','channel','pet','event_id','41000000-0000-0000-0000-000000000001'
  )
);
-- Only one offer can exist with this event_id inside this isolated,
-- rolled-back transaction, so a scoped subquery is enough to find it back
-- without a portable way to capture the function's returned uuid.
select public.set_partner_offer_state(
  (select id from public.offers where event_id='41000000-0000-0000-0000-000000000001'),
  'publish'
);

select set_config('request.jwt.claim.sub','',true);
set local role anon;
select is(
  (select count(*) from public.public_active_offers(null,null,'41000000-0000-0000-0000-000000000001'))::bigint,
  1::bigint,
  'public_active_offers returns the event-linked offer when filtered by that event'
);
select is(
  (select count(*) from public.public_active_offers(null,null,'41000000-0000-0000-0000-000000000002'))::bigint,
  0::bigint,
  'public_active_offers excludes the offer when a different event is requested'
);
select is(
  (select event_id from public.public_active_offers(null,null,'41000000-0000-0000-0000-000000000001') limit 1),
  '41000000-0000-0000-0000-000000000001',
  'the returned offer reports the linked event id'
);

select * from finish();
rollback;
