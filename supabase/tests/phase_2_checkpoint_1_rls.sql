begin;
create extension if not exists pgtap with schema extensions;
select plan(26);

set local role anon;
select throws_ok(
  $$select * from public.partner_organization_candidates('Demo PetBiz A',null,null,null,null,null,null)$$,
  '42501', null,
  'anonymous callers cannot execute candidate matching'
);

-- Partner A owns Demo PetBiz A. Partner B is a separate Partner organization.
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000006',true);

select lives_ok(
  $$insert into public.organization_onboarding_drafts(created_by,partner_kind,form_data)
    values('10000000-0000-0000-0000-000000000006','petbiz','{"name":"Demo PetBiz A"}')$$,
  'a user can save only their own private onboarding draft'
);
select is(
  (select count(*)::bigint from public.organization_onboarding_drafts where created_by='10000000-0000-0000-0000-000000000006'),
  1::bigint,
  'the requester can read their own draft'
);
select is(
  (select count(*)::bigint from public.organization_onboarding_drafts where created_by='10000000-0000-0000-0000-000000000003'),
  0::bigint,
  'the requester cannot read another user draft'
);
select lives_ok(
  $$select public.create_partner_organization(
    'petbiz',
    '{"name":"Atomic Demo Partner","street":"1 Main Street","city":"Detroit","state":"MI","additionalLocations":[{"street":"2 Main Street","city":"Ann Arbor","state":"MI"}]}'::jsonb,
    (select id from public.organization_onboarding_drafts where created_by='10000000-0000-0000-0000-000000000006')
  )$$,
  'atomic partner creation succeeds with membership and multiple locations'
);
select is(
  (select count(*)::bigint from public.organizations where public_name='Atomic Demo Partner'),
  1::bigint,
  'atomic creation creates exactly one organization'
);
select is(
  (select count(*)::bigint from public.organization_memberships m join public.organizations o on o.id=m.organization_id where o.public_name='Atomic Demo Partner' and m.user_id='10000000-0000-0000-0000-000000000006' and m.role='owner'),
  1::bigint,
  'atomic creation creates the explicit owner membership'
);
select is(
  (select count(*)::bigint from public.organization_locations l join public.organizations o on o.id=l.organization_id where o.public_name='Atomic Demo Partner'),
  2::bigint,
  'atomic creation saves all entered locations'
);
select throws_ok(
  $$select public.create_partner_organization(
    'petbiz',
    '{"name":"Atomic denied child","relationship":"corporate_child","parentId":"20000000-0000-0000-0000-000000000001"}'::jsonb,
    (select id from public.organization_onboarding_drafts where created_by='10000000-0000-0000-0000-000000000006')
  )$$,
  '42501', null,
  'atomic creation rejects a parent the user does not manage'
);
select is(
  (select count(*)::bigint from public.organizations where public_name='Atomic denied child'),
  0::bigint,
  'a rejected atomic creation leaves no partial organization'
);
select is(
  (with denied as (
    update public.organizations set public_name='Takeover attempt'
    where id='20000000-0000-0000-0000-000000000001'
    returning id
  ) select count(*)::bigint from denied),
  0::bigint,
  'Partner B cannot edit Partner A organization'
);
select is(
  (select count(*)::bigint from public.partner_organization_candidates('Demo PetBiz A',null,null,null,null,null,null)),
  1::bigint,
  'matching surfaces an existing active organization without creating membership'
);
select lives_ok(
  $$insert into public.organization_access_requests(organization_id,requester_id,request_type,requester_snapshot)
    values('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000006','membership','{}')$$,
  'a requester can submit a membership request'
);
select is(
  (select count(*)::bigint from public.organization_memberships where organization_id='20000000-0000-0000-0000-000000000001' and user_id='10000000-0000-0000-0000-000000000006'),
  0::bigint,
  'a membership request does not grant organization access'
);
select lives_ok(
  $$insert into public.organization_access_requests(organization_id,requester_id,request_type,requester_snapshot)
    values('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000006','ownership_claim','{}')$$,
  'a requester can submit an ownership claim for review'
);
select throws_ok(
  $$insert into public.organizations(created_by,organization_type,organization_type_code,public_name,parent_organization_id,status)
    values('10000000-0000-0000-0000-000000000006','pet_business','pet_business','Unauthorized child','20000000-0000-0000-0000-000000000001','active')$$,
  '42501',null,
  'an unrelated user cannot create a child beneath an organization they do not manage'
);
select lives_ok(
  $$insert into public.organizations(id,created_by,organization_type,organization_type_code,public_name,status)
    values('20000000-0000-0000-0000-000000000009','10000000-0000-0000-0000-000000000006','pet_business','pet_business','Independent Demo Franchise','active')$$,
  'an unrelated user can create an independent organization'
);
select lives_ok(
  $$insert into public.organization_memberships(organization_id,user_id,role)
    values('20000000-0000-0000-0000-000000000009','10000000-0000-0000-0000-000000000006','owner')$$,
  'the independent organization owner receives explicit membership'
);
select lives_ok(
  $$insert into public.organization_locations(organization_id,location_type,is_primary,created_by,city,state_province)
    values
      ('20000000-0000-0000-0000-000000000009','physical',true,'10000000-0000-0000-0000-000000000006','Detroit','MI'),
      ('20000000-0000-0000-0000-000000000009','physical',false,'10000000-0000-0000-0000-000000000006','Ann Arbor','MI')$$,
  'an authorized organization member can add multiple locations'
);
select is(
  (select count(*)::bigint from public.organization_locations where organization_id='20000000-0000-0000-0000-000000000009'),
  2::bigint,
  'multiple locations remain scoped to the authorized organization'
);
select lives_ok(
  $$insert into public.organization_relationships(source_organization_id,target_organization_id,relationship_type_code,status,created_by)
    values('20000000-0000-0000-0000-000000000009','20000000-0000-0000-0000-000000000001','franchise_of','pending','10000000-0000-0000-0000-000000000006')$$,
  'an independent franchise can record a pending brand relationship'
);
select is(
  (select count(*)::bigint from public.organization_memberships where organization_id='20000000-0000-0000-0000-000000000001' and user_id='10000000-0000-0000-0000-000000000006'),
  0::bigint,
  'a franchise relationship never inherits brand control'
);

reset role;
update public.organization_memberships
set status='revoked'
where organization_id='20000000-0000-0000-0000-000000000003'
  and user_id='10000000-0000-0000-0000-000000000006';
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000006',true);
select is(
  (with denied as (
    update public.organizations set public_name='Revoked creator takeover'
    where id='20000000-0000-0000-0000-000000000003'
    returning id
  ) select count(*)::bigint from denied),
  0::bigint,
  'a revoked creator cannot retain organization edit authority'
);
select throws_ok(
  $$insert into public.organization_memberships(organization_id,user_id,role)
    values('20000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000006','owner')$$,
  '42501', null,
  'a revoked creator cannot reactivate their owner membership'
);

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000005',true);
select lives_ok(
  $$insert into public.organization_duplicate_review_cases(primary_organization_id,possible_duplicate_organization_id,created_by,reason)
    values('20000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000005','test duplicate review')$$,
  'platform admin can create a duplicate review case'
);
reset role;
select ok(
  exists(select 1 from private.audit_events where action='organization_duplicate_review'),
  'duplicate review activity is preserved in the private audit trail'
);
select * from finish();
rollback;
