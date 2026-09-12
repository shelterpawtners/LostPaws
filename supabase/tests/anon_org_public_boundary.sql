begin;
create extension if not exists pgtap with schema extensions;
select plan(8);

select ok(
  not has_table_privilege('anon','public.organizations','select'),
  'anon cannot SELECT organizations base table'
);

select ok(
  not has_table_privilege('anon','public.organization_locations','select'),
  'anon cannot SELECT organization_locations base table'
);

select ok(
  has_table_privilege('authenticated','public.organizations','select'),
  'authenticated keeps SELECT on organizations under RLS'
);

select ok(
  has_table_privilege('authenticated','public.organization_locations','select'),
  'authenticated keeps SELECT on organization_locations under RLS'
);

select ok(
  has_function_privilege('anon','public.public_active_offers(uuid,public.market_channel)','execute'),
  'anon can execute curated public_active_offers RPC'
);

select ok(
  has_function_privilege('anon','public.public_partner_directory(text,text,text,text,text)','execute'),
  'anon can execute curated public_partner_directory RPC'
);

select ok(
  has_function_privilege('anon','public.public_partner_profile(uuid)','execute'),
  'anon can execute curated public_partner_profile RPC'
);

select ok(
  has_function_privilege('anon','public.public_partner_profile_details(uuid)','execute'),
  'anon can execute curated public_partner_profile_details RPC'
);

select * from finish();
rollback;
