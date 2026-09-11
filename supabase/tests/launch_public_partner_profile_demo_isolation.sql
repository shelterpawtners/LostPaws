begin;
select plan(3);

-- The seeded QA Partner is intentionally published but demo-only. Anonymous
-- callers must not be able to retrieve it through any direct public profile RPC.
set local role anon;

select is(
  (select count(*)::bigint
   from public.public_partner_profile('20000000-0000-0000-0000-000000000001')),
  0::bigint,
  'compact public partner profile hides published demo organizations'
);

select is(
  public.public_partner_profile_details('20000000-0000-0000-0000-000000000001'),
  null::jsonb,
  'detailed public partner profile hides published demo organizations'
);

select ok(
  has_function_privilege('anon','public.public_partner_profile(uuid)','EXECUTE'),
  'anonymous compact public profile access remains intentionally available'
);

select * from finish();
rollback;
