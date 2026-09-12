begin;
create extension if not exists pgtap with schema extensions;
select plan(16);

-- Fixed ids rather than a temp table: this test switches between the
-- authenticated and anon roles, and a temp table created under one role is not
-- readable by the other (see launch_demo_public_isolation.sql, which uses
-- literal ids for the same reason).
-- 40000000-...0001 = org-owned event, 40000000-...0002 = organization-less event.

-- Org A (20000000-...0001, owned by user 10000000-...0003) creates and
-- publishes a pet-audience event.
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
insert into public.events(id,organization_id,created_by,audience,category,title,summary)
values ('40000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','pet','Adoption Event','Track2 QA Fall Adoption Day','A demo adoption event.');

select is((select count(*) from public.events where id='40000000-0000-0000-0000-000000000001')::bigint,1::bigint,'org can create an event');
select is((select audience from public.events where id='40000000-0000-0000-0000-000000000001'),'pet','audience is stored as pet');
select lives_ok($$update public.events set status='active',published_at=now() where id='40000000-0000-0000-0000-000000000001'$$,'owning org can publish its own event');
select throws_ok($$insert into public.events(organization_id,created_by,audience,category,title,summary) values ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','not_a_real_audience','Adoption Event','Track2 QA Bad audience','x')$$,'23514',null,'invalid audience is rejected by the check constraint');
select lives_ok($$insert into public.event_participants(event_id,organization_id,role,created_by) values ('40000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','hosting','10000000-0000-0000-0000-000000000003')$$,'event owner can add itself as a hosting participant');

-- Org B (20000000-...0003, owned by user 10000000-...0006) is a different
-- organization from Org A.
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000006',true);
-- Row level security filters the row out of the UPDATE rather than raising, so
-- the assertion is that nothing changed, not that an error was thrown.
update public.events set title='Hijacked' where id='40000000-0000-0000-0000-000000000001';
select isnt((select title from public.events where id='40000000-0000-0000-0000-000000000001'),'Hijacked','a non-managing organization cannot update another organization''s event');
select throws_ok($$insert into public.event_participants(event_id,organization_id,role,created_by) values ('40000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','vending','10000000-0000-0000-0000-000000000006')$$,'42501',null,'a business cannot add participation on behalf of an organization it does not manage');
select lives_ok($$insert into public.event_participants(event_id,organization_id,role,created_by) values ('40000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','vending','10000000-0000-0000-0000-000000000006')$$,'a different organization can add its own participation on someone else''s published event');
select throws_ok($$insert into public.event_participants(event_id,organization_id,role,created_by) values ('40000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','vending','10000000-0000-0000-0000-000000000006')$$,'23505',null,'duplicate event/organization/role participation is rejected');

-- A guardian (no organization) creates a solo, organization-less event.
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
insert into public.events(id,organization_id,created_by,audience,category,title,summary)
values ('40000000-0000-0000-0000-000000000002',null,'10000000-0000-0000-0000-000000000001','human','Community Event','Track2 QA Neighborhood Meetup','A demo community event with no owning business.');
select is((select created_by from public.events where id='40000000-0000-0000-0000-000000000002'),'10000000-0000-0000-0000-000000000001','a guardian can create an organization-less event');

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
update public.events set title='Taken over' where id='40000000-0000-0000-0000-000000000002';
select is((select count(*) from public.events where id='40000000-0000-0000-0000-000000000002')::bigint,0::bigint,'another user cannot even see someone else''s organization-less draft event');

select set_config('request.jwt.claim.sub','',true);
set local role anon;
select is((select count(*) from public.events where id='40000000-0000-0000-0000-000000000001')::bigint,1::bigint,'anon can see the published org event');
select is((select count(*) from public.events where id='40000000-0000-0000-0000-000000000002')::bigint,0::bigint,'anon cannot see the unpublished organization-less event');
select is((select count(*) from public.event_participants where event_id='40000000-0000-0000-0000-000000000001')::bigint,2::bigint,'anon can see both participants of the published event');

reset role;
select is((select count(*) from public.events where id in ('40000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002'))::bigint,2::bigint,'both demo events exist when row level security is bypassed');
select isnt((select title from public.events where id='40000000-0000-0000-0000-000000000002'),'Taken over','the organization-less event survived another user''s update attempt');

select * from finish();
rollback;
