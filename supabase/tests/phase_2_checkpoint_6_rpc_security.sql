begin;
create extension if not exists pgtap with schema extensions;
select plan(5);

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

select ok(
  not has_function_privilege('anon','public.create_partner_offer(uuid,jsonb)','EXECUTE')
  and not has_function_privilege('anon','public.revise_partner_offer(uuid,jsonb)','EXECUTE')
  and not has_function_privilege('anon','public.set_partner_offer_state(uuid,text)','EXECUTE')
  and not has_function_privilege('anon','public.duplicate_partner_offer(uuid)','EXECUTE')
  and not has_function_privilege('anon','public.claim_offer(uuid,uuid)','EXECUTE')
  and not has_function_privilege('anon','public.validate_redemption_code(text)','EXECUTE')
  and not has_function_privilege('anon','public.confirm_redemption(text,uuid,jsonb)','EXECUTE')
  and not has_function_privilege('anon','public.reverse_redemption(uuid,text)','EXECUTE')
  and not has_function_privilege('anon','public.record_redemption_adjustment(uuid,bigint,bigint,text,jsonb)','EXECUTE'),
  'anonymous callers cannot execute state-changing offer and redemption RPCs'
);

select ok(
  has_function_privilege('authenticated','public.create_partner_offer(uuid,jsonb)','EXECUTE')
  and has_function_privilege('authenticated','public.revise_partner_offer(uuid,jsonb)','EXECUTE')
  and has_function_privilege('authenticated','public.set_partner_offer_state(uuid,text)','EXECUTE')
  and has_function_privilege('authenticated','public.duplicate_partner_offer(uuid)','EXECUTE')
  and has_function_privilege('authenticated','public.claim_offer(uuid,uuid)','EXECUTE')
  and has_function_privilege('authenticated','public.validate_redemption_code(text)','EXECUTE')
  and has_function_privilege('authenticated','public.confirm_redemption(text,uuid,jsonb)','EXECUTE')
  and has_function_privilege('authenticated','public.reverse_redemption(uuid,text)','EXECUTE')
  and has_function_privilege('authenticated','public.record_redemption_adjustment(uuid,bigint,bigint,text,jsonb)','EXECUTE'),
  'signed-in callers retain execute access to state-changing offer and redemption RPCs'
);

select ok(
  has_function_privilege('anon','public.public_active_offers(uuid)','EXECUTE')
  and has_function_privilege('anon','public.public_partner_directory(text,text,text,text,text)','EXECUTE')
  and has_function_privilege('anon','public.public_partner_profile(uuid)','EXECUTE')
  and has_function_privilege('anon','public.public_partner_profile_details(uuid)','EXECUTE'),
  'anonymous callers retain deliberate read-only public discovery RPCs'
);

select * from finish();
rollback;
