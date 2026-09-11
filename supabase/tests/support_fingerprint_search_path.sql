begin;
create extension if not exists pgtap with schema extensions;
select plan(2);

select ok(
  exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'private'
      and p.proname = 'support_ticket_fingerprint'
      and p.proconfig @> array['search_path=pg_catalog']::text[]
  ),
  'support fingerprint helper pins its search_path to pg_catalog'
);

select is(
  private.support_ticket_fingerprint('bug','/dashboard','  Save   fails '),
  private.support_ticket_fingerprint('BUG','/dashboard','save fails'),
  'support fingerprint normalization behavior is unchanged'
);

select * from finish();
rollback;
