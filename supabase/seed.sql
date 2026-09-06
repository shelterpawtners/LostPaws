-- Deterministic Phase 1 demo data. All email domains are reserved and cannot receive mail.
-- IDs are stable so database authorization tests can impersonate each persona.
insert into auth.users (
  instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,
  raw_app_meta_data,raw_user_meta_data,created_at,updated_at
) values
 ('00000000-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000001','authenticated','authenticated','guardian-a@example.invalid',crypt('Demo-only-Guardian-A!',gen_salt('bf')),now(),'{}','{"full_name":"Guardian A","onboarding_type":"guardian"}',now(),now()),
 ('00000000-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000002','authenticated','authenticated','guardian-b@example.invalid',crypt('Demo-only-Guardian-B!',gen_salt('bf')),now(),'{}','{"full_name":"Guardian B","onboarding_type":"guardian"}',now(),now()),
 ('00000000-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000003','authenticated','authenticated','partner-admin@example.invalid',crypt('Demo-only-Partner!',gen_salt('bf')),now(),'{}','{"full_name":"Partner Admin","onboarding_type":"petbiz"}',now(),now()),
 ('00000000-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000004','authenticated','authenticated','shelter-admin@example.invalid',crypt('Demo-only-Shelter!',gen_salt('bf')),now(),'{}','{"full_name":"Shelter Admin","onboarding_type":"shelter"}',now(),now()),
 ('00000000-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000005','authenticated','authenticated','platform-admin@example.invalid',crypt('Demo-only-Platform!',gen_salt('bf')),now(),'{}','{"full_name":"Platform Admin","onboarding_type":"guardian"}',now(),now())
on conflict(id) do nothing;

-- GoTrue scans these token fields as strings during password authentication.
-- Directly seeded users must use empty strings rather than nullable defaults.
update auth.users
set confirmation_token = coalesce(confirmation_token, ''),
    recovery_token = coalesce(recovery_token, ''),
    email_change_token_new = coalesce(email_change_token_new, ''),
    email_change = coalesce(email_change, ''),
    email_change_token_current = coalesce(email_change_token_current, ''),
    reauthentication_token = coalesce(reauthentication_token, '')
where email like '%@example.invalid';

insert into public.user_roles(user_id,role_code,assigned_by) values
 ('10000000-0000-0000-0000-000000000003','partner_admin','10000000-0000-0000-0000-000000000005'),
 ('10000000-0000-0000-0000-000000000004','shelter_admin','10000000-0000-0000-0000-000000000005'),
 ('10000000-0000-0000-0000-000000000005','platform_admin','10000000-0000-0000-0000-000000000005')
on conflict do nothing;

insert into public.organizations(id,created_by,organization_type,organization_type_code,public_name,status,is_demo) values
 ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','pet_business','pet_business','Demo PetBiz A','active',true),
 ('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000004','shelter','shelter','Demo Shelter B','active',true)
on conflict(id) do nothing;
insert into public.organization_memberships(organization_id,user_id,role,status) values
 ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','owner','active'),
 ('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000004','owner','active')
on conflict(organization_id,user_id) do update set role=excluded.role,status=excluded.status;

insert into public.pets(id,created_by,name,species,is_demo) values
 ('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Demo Pet A','dog',true),
 ('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','Demo Pet B','cat',true)
on conflict(id) do nothing;
insert into public.guardianships(pet_id,guardian_id,relationship,status) values
 ('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','primary','active'),
 ('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','primary','active')
on conflict do nothing;
