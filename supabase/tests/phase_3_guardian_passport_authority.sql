begin;
create extension if not exists pgtap with schema extensions;
select plan(6);

-- Active primary Guardian can update their pet.
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
update public.pets
set breed='Phase 3 QA breed'
where id='30000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select breed from public.pets where id='30000000-0000-0000-0000-000000000001'),
  'Phase 3 QA breed',
  'active primary Guardian can update their pet'
);

-- Another Guardian cannot update that pet.
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000002',true);
update public.pets
set breed='Unauthorized change'
where id='30000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select breed from public.pets where id='30000000-0000-0000-0000-000000000001'),
  'Phase 3 QA breed',
  'unrelated Guardian cannot update another Guardian pet'
);

-- A co-Guardian may read through the relationship but CP1 intentionally does
-- not grant edit authority until the co-Guardian controller rules are defined.
insert into public.guardianships(pet_id,guardian_id,relationship,status)
values(
  '30000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000001',
  'co_guardian',
  'active'
);
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
update public.pets
set breed='Co-Guardian change'
where id='30000000-0000-0000-0000-000000000002';
reset role;
select ok(
  (select breed is distinct from 'Co-Guardian change' from public.pets where id='30000000-0000-0000-0000-000000000002'),
  'co-Guardian does not receive edit authority in CP1'
);

-- Historical creator provenance alone no longer grants UPDATE authority.
insert into public.pets(id,created_by,name,species,is_demo)
values(
  '30000000-0000-0000-0000-000000000099',
  '10000000-0000-0000-0000-000000000001',
  'Historical creator pet',
  'dog',
  true
);
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
update public.pets
set breed='Creator-only change'
where id='30000000-0000-0000-0000-000000000099';
reset role;
select ok(
  (select breed is null from public.pets where id='30000000-0000-0000-0000-000000000099'),
  'historical creator without active primary guardianship cannot update pet'
);

-- Existing self-profile update remains private and functional.
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
update public.profiles
set phone='248-555-0101'
where id='10000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select phone from public.profiles where id='10000000-0000-0000-0000-000000000001'),
  '248-555-0101',
  'user can update own private profile'
);

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
update public.profiles
set phone='248-555-0199'
where id='10000000-0000-0000-0000-000000000002';
reset role;
select ok(
  (select phone is distinct from '248-555-0199' from public.profiles where id='10000000-0000-0000-0000-000000000002'),
  'user cannot update another private profile'
);

select * from finish();
rollback;
