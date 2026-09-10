begin;
create extension if not exists pgtap with schema extensions;
select plan(9);

set local role postgres;

insert into public.organizations(
  id,created_by,organization_type,organization_type_code,public_name,status,is_demo
) values (
  '22000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000003',
  'pet_business','pet_business','Launch Real PetBiz','active',false
);

insert into public.organization_memberships(organization_id,user_id,role,status)
values (
  '22000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000003',
  'owner','active'
);

insert into public.organization_partner_profiles(
  organization_id,public_description,business_model,publication_status
) values
  ('22000000-0000-0000-0000-000000000001','A real launch-visible profile.','online','published'),
  ('20000000-0000-0000-0000-000000000001','A QA-only demo profile.','online','published')
on conflict (organization_id) do update
set public_description=excluded.public_description,
    business_model=excluded.business_model,
    publication_status=excluded.publication_status;

insert into public.organization_private_contacts(
  organization_id,primary_contact_email,operational_contact_email
) values (
  '22000000-0000-0000-0000-000000000001',
  'private-launch@example.invalid',
  'ops-launch@example.invalid'
);

set local role anon;
select is(
  (select count(*)::bigint from public.public_partner_directory() where organization_id='20000000-0000-0000-0000-000000000001'),
  0::bigint,
  'published demo organization is excluded from the public directory'
);
select is(
  public.public_partner_profile_details('20000000-0000-0000-0000-000000000001'),
  null::jsonb,
  'published demo organization is excluded from direct public profile lookup'
);
select is(
  (select count(*)::bigint from public.public_partner_directory() where organization_id='22000000-0000-0000-0000-000000000001'),
  1::bigint,
  'published non-demo organization remains visible in the public directory'
);
select ok(
  public.public_partner_profile_details('22000000-0000-0000-0000-000000000001') is not null,
  'published non-demo organization remains available through public profile details'
);
select ok(
  not (public.public_partner_profile_details('22000000-0000-0000-0000-000000000001') ? 'primary_contact_email'),
  'public non-demo profile details still exclude private contacts'
);

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);

create temp table launch_offer_ids(kind text primary key, offer_id uuid);
insert into launch_offer_ids(kind,offer_id)
values (
  'demo',
  public.create_partner_offer(
    '20000000-0000-0000-0000-000000000001',
    '{"title":"Launch isolation demo offer","summary":"QA-only offer.","terms":"QA only.","redemption_instructions":"Use only in QA."}'::jsonb
  )
),(
  'real',
  public.create_partner_offer(
    '22000000-0000-0000-0000-000000000001',
    '{"title":"Launch isolation real offer","summary":"Public launch test offer.","terms":"Launch regression terms.","redemption_instructions":"Show the code."}'::jsonb
  )
);

select ok(
  (select is_demo from public.offers where id=(select offer_id from launch_offer_ids where kind='demo')),
  'offer created under a demo organization inherits is_demo=true'
);
select ok(
  not (select is_demo from public.offers where id=(select offer_id from launch_offer_ids where kind='real')),
  'offer created under a non-demo organization keeps is_demo=false'
);

select public.set_partner_offer_state((select offer_id from launch_offer_ids where kind='demo'),'publish');
select public.set_partner_offer_state((select offer_id from launch_offer_ids where kind='real'),'publish');

set local role anon;
select is(
  (select count(*)::bigint from public.public_active_offers(null) where offer_id=(select offer_id from launch_offer_ids where kind='demo')),
  0::bigint,
  'published demo offer never appears in public Marketplace results'
);
select is(
  (select count(*)::bigint from public.public_active_offers(null) where offer_id=(select offer_id from launch_offer_ids where kind='real')),
  1::bigint,
  'published non-demo offer remains visible in public Marketplace results'
);

select * from finish();
rollback;
