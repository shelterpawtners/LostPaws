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
 ('00000000-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000005','authenticated','authenticated','platform-admin@example.invalid',crypt('Demo-only-Platform!',gen_salt('bf')),now(),'{}','{"full_name":"Platform Admin","onboarding_type":"guardian"}',now(),now()),
 ('00000000-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000006','authenticated','authenticated','partner-b@example.invalid',crypt('Demo-only-Partner-B!',gen_salt('bf')),now(),'{}','{"full_name":"Partner B","onboarding_type":"petbiz"}',now(),now()),
 ('00000000-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000007','authenticated','authenticated','rave-vendor@example.invalid',crypt('Demo-only-RAVE-Vendor!',gen_salt('bf')),now(),'{}','{"full_name":"RAVE Vendor","onboarding_type":"rave_vendor"}',now(),now())
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
 ('10000000-0000-0000-0000-000000000006','partner_admin','10000000-0000-0000-0000-000000000005'),
 ('10000000-0000-0000-0000-000000000004','shelter_admin','10000000-0000-0000-0000-000000000005'),
 ('10000000-0000-0000-0000-000000000005','platform_admin','10000000-0000-0000-0000-000000000005'),
 ('10000000-0000-0000-0000-000000000007','partner_admin','10000000-0000-0000-0000-000000000005')
on conflict do nothing;

insert into public.organizations(id,created_by,organization_type,organization_type_code,public_name,status,is_demo) values
 ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','pet_business','pet_business','Demo PetBiz A','active',true),
 ('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000004','shelter','shelter','Demo Shelter B','active',true),
 ('20000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000006','pet_business','pet_business','Demo PetBiz B','active',true),
 ('20000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000007','rave_vendor','community_partner','Demo RAVE Vendor','active',true)
on conflict(id) do nothing;
insert into public.organization_memberships(organization_id,user_id,role,status) values
 ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','owner','active'),
 ('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000004','owner','active'),
 ('20000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000006','owner','active'),
 ('20000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000007','owner','active')
on conflict(organization_id,user_id) do update set role=excluded.role,status=excluded.status;

insert into public.pets(id,created_by,name,species,is_demo) values
 ('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Demo Pet A','dog',true),
 ('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','Demo Pet B','cat',true)
on conflict(id) do nothing;
insert into public.guardianships(pet_id,guardian_id,relationship,status) values
 ('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','primary','active'),
 ('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','primary','active')
on conflict do nothing;

-- Demo events so the /events surface is reviewable locally. is_demo is false
-- because these are the seeded review fixtures the QA personas expect to see;
-- the demo-isolation rules that hide seeded data apply to offers and partner
-- profiles, not events.
insert into public.events(
  id,organization_id,created_by,audience,category,title,summary,service_area,is_online,starts_at,ends_at,status,published_at
) values
 ('40000000-0000-0000-0000-0000000000f1','20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000004',
  'pet','Adoption Event','Demo Saturday Adoption Day',
  'Meet adoptable dogs and cats, and ask the shelter team anything.',
  'Detroit, MI',false,now()+interval '9 days',now()+interval '9 days 6 hours','active',now()),
 ('40000000-0000-0000-0000-0000000000f2','20000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000006',
  'human','Art / Maker Market','Demo Makers Market',
  'Independent artists and makers, with part of each sale going to a shelter.',
  'Columbus, OH',false,now()+interval '16 days',now()+interval '17 days','active',now()),
 ('40000000-0000-0000-0000-0000000000f3',null,'10000000-0000-0000-0000-000000000001',
  'both','Pet-Friendly Community Event','Demo Community Dog Walk',
  'A relaxed walk open to everyone, dogs very welcome.',
  'Online sign-up, walk in Ann Arbor, MI',false,now()+interval '23 days',null,'active',now())
on conflict(id) do nothing;

insert into public.event_participants(event_id,organization_id,role,created_by) values
 ('40000000-0000-0000-0000-0000000000f1','20000000-0000-0000-0000-000000000002','hosting','10000000-0000-0000-0000-000000000004'),
 ('40000000-0000-0000-0000-0000000000f2','20000000-0000-0000-0000-000000000003','vending','10000000-0000-0000-0000-000000000006')
on conflict do nothing;
