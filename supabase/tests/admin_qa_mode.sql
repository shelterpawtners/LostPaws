begin;
create extension if not exists pgtap with schema extensions;
select plan(4);

set local role anon;
select is((select count(*)::bigint from private.audit_events),0::bigint,'anonymous callers cannot read QA audit evidence');

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
select ok(not private.is_platform_admin(),'a forged frontend role is not platform-admin authorization');
select is((select count(*)::bigint from public.user_roles where user_id='10000000-0000-0000-0000-000000000005' and role_code='platform_admin' and revoked_at is null),0::bigint,'non-admin cannot discover another platform-admin role');

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000005',true);
select ok(private.is_platform_admin(),'the seeded platform administrator is role-authorized');

select * from finish();
rollback;
