begin;
create extension if not exists pgtap with schema extensions;
select plan(7);

set local role postgres;

insert into public.organizations(
  id,created_by,organization_type,public_name,status,is_demo
) values (
  '23000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000005',
  'pet_business',
  'Launch Public Program Source',
  'active',
  false
);

insert into public.offers(
  id,organization_id,created_by,channel,title,summary,category,classification,
  destination_url,eligibility,last_verified_at,status,published_at,is_demo
) values (
  '23000000-0000-0000-0000-000000000011',
  '23000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000005',
  'pet',
  'Launch public benefit',
  'Official third-party public benefit used for launch-boundary regression.',
  'adoption_support',
  'public_program',
  'https://example.org/program',
  'New adopters meeting the provider requirements.',
  '2026-09-09T12:00:00Z',
  'active',
  now(),
  false
),(
  '23000000-0000-0000-0000-000000000012',
  '23000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000005',
  'pet',
  'Launch community resource',
  'Official third-party community resource used for launch-boundary regression.',
  'adoption_support',
  'community',
  'https://example.org/resource',
  'People using the public resource.',
  '2026-09-09T12:00:00Z',
  'active',
  now(),
  false
);

insert into public.offer_versions(
  id,offer_id,version_number,title,summary,details,terms,status,published_at,
  created_by,eligibility_kind,claim_window_days,redemption_instructions,
  source_url,disclosure
) values (
  '23000000-0000-0000-0000-000000000021',
  '23000000-0000-0000-0000-000000000011',
  1,
  'Launch public benefit',
  'Official third-party public benefit used for launch-boundary regression.',
  'Regression detail.',
  'Provider terms control.',
  'published',
  now(),
  '10000000-0000-0000-0000-000000000005',
  'all_pets',
  30,
  'Use the official provider site.',
  'https://example.org/source',
  'Public third-party program; no ShelterPawtners partnership is implied.'
),(
  '23000000-0000-0000-0000-000000000022',
  '23000000-0000-0000-0000-000000000012',
  1,
  'Launch community resource',
  'Official third-party community resource used for launch-boundary regression.',
  'Regression detail.',
  'Provider terms control.',
  'published',
  now(),
  '10000000-0000-0000-0000-000000000005',
  'all_pets',
  30,
  'Use the official provider site.',
  'https://example.org/source',
  'Public third-party resource; no ShelterPawtners partnership is implied.'
);

update public.offers
set current_version_id = case id
  when '23000000-0000-0000-0000-000000000011'::uuid then '23000000-0000-0000-0000-000000000021'::uuid
  when '23000000-0000-0000-0000-000000000012'::uuid then '23000000-0000-0000-0000-000000000022'::uuid
end
where id in (
  '23000000-0000-0000-0000-000000000011',
  '23000000-0000-0000-0000-000000000012'
);

set local role anon;
select is(
  (select count(*)::bigint from public.public_active_offers(null)
   where offer_id='23000000-0000-0000-0000-000000000011'),
  1::bigint,
  'verified public program is visible in anonymous Marketplace results'
);
select is(
  (select destination_url from public.public_active_offers(null)
   where offer_id='23000000-0000-0000-0000-000000000011'),
  'https://example.org/program'::text,
  'public Marketplace exposes the official user destination URL'
);
select is(
  (select eligibility from public.public_active_offers(null)
   where offer_id='23000000-0000-0000-0000-000000000011'),
  'New adopters meeting the provider requirements.'::text,
  'public Marketplace exposes explicit eligibility text'
);
select is(
  (select last_verified_at from public.public_active_offers(null)
   where offer_id='23000000-0000-0000-0000-000000000011'),
  '2026-09-09T12:00:00Z'::timestamptz,
  'public Marketplace exposes the listing verification timestamp'
);
select ok(
  has_function_privilege('anon','public.public_active_offers(uuid)','EXECUTE'),
  'anonymous users retain read access to the public Marketplace RPC'
);

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
select throws_ok(
  $$select * from public.claim_offer('23000000-0000-0000-0000-000000000011',null)$$,
  'P0001',
  'Public programs and community resources are accessed through their official source',
  'public programs cannot create ShelterPawtners claims'
);
select throws_ok(
  $$select * from public.claim_offer('23000000-0000-0000-0000-000000000012',null)$$,
  'P0001',
  'Public programs and community resources are accessed through their official source',
  'community resources cannot create ShelterPawtners claims'
);

select * from finish();
rollback;
