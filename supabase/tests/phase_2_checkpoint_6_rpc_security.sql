begin;
create extension if not exists pgtap with schema extensions;
select plan(2);

select ok(
  not exists(
    select 1
    from pg_catalog.pg_proc p
    join pg_catalog.pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public'
      and p.proname in (
        'create_partner_contribution_commitment',
        'set_partner_contribution_commitment_state',
        'submit_partner_contribution_evidence',
        'review_partner_contribution_evidence',
        'review_partner_good_standing',
        'partner_impact_summary',
        'partner_participation_state',
        'public_partner_impact_summary'
      )
      and p.prosecdef
  ),
  'CP6 does not add public SECURITY DEFINER RPC endpoints'
);

select ok(
  exists(select 1 from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace where n.nspname='private' and p.proname='create_partner_contribution_commitment' and p.prosecdef)
  and exists(select 1 from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='create_partner_contribution_commitment' and not p.prosecdef),
  'privileged CP6 implementation stays private behind an invoker wrapper'
);

select * from finish();
rollback;
