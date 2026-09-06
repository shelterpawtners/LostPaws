begin;
create extension if not exists pgtap with schema extensions;
select plan(9);

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
select is((select count(*)::bigint from public.pets where id='30000000-0000-0000-0000-000000000002'),0::bigint,'Guardian A cannot read Guardian B pet');
select is((select count(*)::bigint from public.profiles where id='10000000-0000-0000-0000-000000000002'),0::bigint,'Guardian A cannot read Guardian B profile');
select throws_ok($$insert into public.user_roles(user_id,role_code) values('10000000-0000-0000-0000-000000000001','platform_admin')$$,'42501',null,'normal user cannot self-assign platform_admin');
select is((select count(*)::bigint from public.donation_transactions),0::bigint,'normal user cannot browse donation transactions');
select is((select count(*)::bigint from public.pet_identifiers),0::bigint,'partner-independent user sees no private identifiers');

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
select is((select count(*)::bigint from public.organizations where id='20000000-0000-0000-0000-000000000002'),1::bigint,'public organization data remains readable');
select is((select count(*)::bigint from public.pets),0::bigint,'Partner cannot browse private Passport pets');
select is((select count(*)::bigint from public.organizations where id='20000000-0000-0000-0000-000000000001' and is_demo),1::bigint,'demo organization is explicitly labeled');

reset role;
insert into public.economic_events(id,event_type,status,finalized_at,is_demo) values('40000000-0000-0000-0000-000000000001','redemption','finalized',now(),true);
select throws_ok($$update public.economic_events set metadata='{"changed":true}' where id='40000000-0000-0000-0000-000000000001'$$,'P0001','Finalized records are append-only','finalized economic event cannot be altered');

select * from finish();
rollback;
