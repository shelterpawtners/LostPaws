begin;
create extension if not exists pgtap with schema extensions;
select plan(8);

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
create temp table onboarding_result(pet_id uuid);
insert into onboarding_result values(public.save_guardian_onboarding_pet(
  '50000000-0000-0000-0000-000000000001','Onboarding Pet','dog',false
));
select ok((select pet_id is not null from onboarding_result),'Guardian onboarding returns a pet id');
select is((select count(*) from public.pets where id=(select pet_id from onboarding_result))::bigint,1::bigint,'onboarding creates one pet');
select is((select count(*) from public.guardianships where pet_id=(select pet_id from onboarding_result) and guardian_id='10000000-0000-0000-0000-000000000001' and ended_at is null)::bigint,1::bigint,'onboarding creates one active primary guardianship');
select is(public.save_guardian_onboarding_pet('50000000-0000-0000-0000-000000000001','Onboarding Pet','dog',false),(select pet_id from onboarding_result),'retry returns the same pet');
select is((select count(*) from public.pets where onboarding_submission_id='50000000-0000-0000-0000-000000000001')::bigint,1::bigint,'retry does not duplicate the pet');
select is((select count(*) from public.guardianships where pet_id=(select pet_id from onboarding_result) and ended_at is null)::bigint,1::bigint,'retry does not duplicate the guardianship');

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000002',true);
select is((select count(*) from public.pets where id=(select pet_id from onboarding_result))::bigint,0::bigint,'another Guardian cannot read the pet');
select is((select count(*) from public.pets where onboarding_submission_id='50000000-0000-0000-0000-000000000001')::bigint,0::bigint,'another Guardian cannot discover the submission pet');

select * from finish();
rollback;
