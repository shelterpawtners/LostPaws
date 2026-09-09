begin;
create extension if not exists pgtap with schema extensions;
select plan(16);

-- Demo PetBiz A is owned by user ...003; Demo PetBiz B by ...006.
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
select lives_ok(
  $$insert into public.organization_partner_profiles(organization_id,public_description,business_model,public_booking_url)
    values('20000000-0000-0000-0000-000000000001','Safe public profile','online','https://example.invalid/book')$$,
  'an authorized Partner can create its own profile'
);
select lives_ok(
  $$insert into public.organization_private_contacts(organization_id,primary_contact_email,operational_contact_email)
    values('20000000-0000-0000-0000-000000000001','owner@example.invalid','ops@example.invalid')$$,
  'an owner can create private contacts for its organization'
);
select lives_ok(
  $$select public.publish_partner_profile('20000000-0000-0000-0000-000000000001')$$,
  'an online Partner can publish without a street address'
);

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000006',true);
update public.organization_partner_profiles set public_description='takeover' where organization_id='20000000-0000-0000-0000-000000000001';
select is(
  (select public_description from public.organization_partner_profiles where organization_id='20000000-0000-0000-0000-000000000001'),
  'Safe public profile',
  'Partner B cannot edit Partner A profile'
);
update public.organization_private_contacts set primary_contact_email='takeover@example.invalid' where organization_id='20000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select primary_contact_email from public.organization_private_contacts where organization_id='20000000-0000-0000-0000-000000000001'),
  'owner@example.invalid',
  'Partner B cannot edit Partner A private contacts'
);
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000006',true);
select lives_ok(
  $$insert into public.organization_partner_profiles(organization_id,public_description,business_model)
    values('20000000-0000-0000-0000-000000000003','Partner B profile','online')$$,
  'Partner B can create its own profile before later revocation'
);
select throws_ok(
  $$insert into public.organization_social_links(organization_id,platform,url) values('20000000-0000-0000-0000-000000000003','instagram','javascript:alert(1)')$$,
  '23514', null, 'invalid social-link protocol is rejected'
);

set local role anon;
select is((select count(*)::bigint from public.organization_private_contacts),0::bigint,'public users cannot read private contacts');
select ok(not (public.public_partner_profile_details('20000000-0000-0000-0000-000000000001') ? 'primary_contact_email'),'public profile details exclude private contacts');

reset role;
update public.organization_partner_profiles set publication_status='unpublished' where organization_id='20000000-0000-0000-0000-000000000001';
set local role anon;
select is((select count(*)::bigint from public.public_partner_directory()),0::bigint,'unpublished profile is absent from the public directory');
select is(public.public_partner_profile_details('20000000-0000-0000-0000-000000000001'),null::jsonb,'unpublished profile is absent from public details');
reset role;
select ok(exists(select 1 from public.organization_partner_profiles where organization_id='20000000-0000-0000-0000-000000000001'),'unpublish retains the profile record');

update public.organization_partner_profiles set publication_status='suspended' where organization_id='20000000-0000-0000-0000-000000000001';
set local role anon;
select is((select count(*)::bigint from public.public_partner_directory()),0::bigint,'suspended profile is absent from public RPCs');

reset role;
update public.organization_partner_profiles set publication_status='removed' where organization_id='20000000-0000-0000-0000-000000000001';
set local role anon;
select is((select count(*)::bigint from public.public_partner_directory()),0::bigint,'removed profile is absent from public RPCs');

reset role;
update public.organization_partner_profiles set publication_status='draft',public_description=null where organization_id='20000000-0000-0000-0000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
select throws_ok($$select public.publish_partner_profile('20000000-0000-0000-0000-000000000001')$$,'23514',null,'publication requirements are enforced server-side');

reset role;
update public.organization_partner_profiles set public_description='Former owner cannot edit' where organization_id='20000000-0000-0000-0000-000000000003';
update public.organization_memberships set status='revoked' where organization_id='20000000-0000-0000-0000-000000000003' and user_id='10000000-0000-0000-0000-000000000006';
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000006',true);
update public.organization_partner_profiles set public_description='revoked edit' where organization_id='20000000-0000-0000-0000-000000000003';
reset role;
select is((select public_description from public.organization_partner_profiles where organization_id='20000000-0000-0000-0000-000000000003'),'Former owner cannot edit','revoked former creator cannot edit its profile');

select * from finish();
rollback;
