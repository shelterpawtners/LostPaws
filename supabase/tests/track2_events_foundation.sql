begin;
create extension if not exists pgtap with schema extensions;
select plan(16);

create temp table test_event_ids(org_event uuid, solo_event uuid);
insert into test_event_ids default values;

-- Org A (20000000-...0001, owned by user 10000000-...0003) creates and
-- publishes a pet-audience event.
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
insert into public.events(organization_id,created_by,audience,category,title,summary)
values ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','pet','Adoption Event','Track2 QA Fall Adoption Day','A demo adoption event.');
update test_event_ids set org_event=(select id from public.events where title='Track2 QA Fall Adoption Day');

select is((select count(*) from public.events where id=(select org_event from test_event_ids))::bigint,1::bigint,'org can create an event');
select is((select audience from public.events where id=(select org_event from test_event_ids)),'pet','audience is stored as pet');
select lives_ok(format($$update public.events set status='active',published_at=now() where id='%s'$$,(select org_event from test_event_ids)),'owning org can publish its own event');
select throws_ok($$insert into public.events(organization_id,created_by,audience,category,title,summary) values ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','not_a_real_audience','Adoption Event','Track2 QA Bad audience','x')$$,'23514',null,'invalid audience is rejected by the check constraint');
select lives_ok(format($$insert into public.event_participants(event_id,organization_id,role,created_by) values ('%s','20000000-0000-0000-0000-000000000001','hosting','10000000-0000-0000-0000-000000000003')$$,(select org_event from test_event_ids)),'event owner can add itself as a hosting participant');

-- Org B (20000000-...0003, owned by user 10000000-...0006) is a different
-- organization from Org A.
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000006',true);
select throws_ok(format($$update public.events set title='Hijacked' where id='%s'$$,(select org_event from test_event_ids)),'42501',null,'a non-managing organization cannot update another organization''s event');
select throws_ok(format($$insert into public.event_participants(event_id,organization_id,role,created_by) values ('%s','20000000-0000-0000-0000-000000000001','vending','10000000-0000-0000-0000-000000000006')$$,(select org_event from test_event_ids)),'42501',null,'a business cannot add participation on behalf of an organization it does not manage');
select lives_ok(format($$insert into public.event_participants(event_id,organization_id,role,created_by) values ('%s','20000000-0000-0000-0000-000000000003','vending','10000000-0000-0000-0000-000000000006')$$,(select org_event from test_event_ids)),'a different organization can add its own participation on someone else''s published event');
select throws_ok(format($$insert into public.event_participants(event_id,organization_id,role,created_by) values ('%s','20000000-0000-0000-0000-000000000003','vending','10000000-0000-0000-0000-000000000006')$$,(select org_event from test_event_ids)),'23505',null,'duplicate event/organization/role participation is rejected');

-- A guardian (no organization) creates a solo, organization-less event.
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
insert into public.events(organization_id,created_by,audience,category,title,summary)
values (null,'10000000-0000-0000-0000-000000000001','human','Community Event','Track2 QA Neighborhood Meetup','A demo community event with no owning business.');
update test_event_ids set solo_event=(select id from public.events where title='Track2 QA Neighborhood Meetup');
select is((select created_by from public.events where id=(select solo_event from test_event_ids)),'10000000-0000-0000-0000-000000000001','a guardian can create an organization-less event');

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
select throws_ok(format($$update public.events set title='Taken over' where id='%s'$$,(select solo_event from test_event_ids)),'42501',null,'another user cannot edit someone else''s organization-less draft event');
select is((select count(*) from public.events where id=(select solo_event from test_event_ids))::bigint,0::bigint,'another user cannot even see someone else''s organization-less draft event');

select set_config('request.jwt.claim.sub','',true);
set local role anon;
select is((select count(*) from public.events where id=(select org_event from test_event_ids))::bigint,1::bigint,'anon can see the published org event');
select is((select count(*) from public.events where id=(select solo_event from test_event_ids))::bigint,0::bigint,'anon cannot see the unpublished organization-less event');
select is((select count(*) from public.event_participants where event_id=(select org_event from test_event_ids))::bigint,2::bigint,'anon can see both participants of the published event');

reset role;
select is((select count(*) from public.events where id in (select org_event from test_event_ids union select solo_event from test_event_ids))::bigint,2::bigint,'both demo events exist for cleanup visibility');

select * from finish();
rollback;
