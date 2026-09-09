-- Each trigger table has different record fields; branch before accessing them.
create or replace function private.capture_organization_review_audit()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  if tg_table_name = 'organization_access_requests' then
    insert into private.audit_events(actor_id, action, target_type, target_id, outcome, context)
    values (
      (select auth.uid()), 'organization_access_request', tg_table_name, new.id, new.status,
      jsonb_build_object('organization_id', new.organization_id, 'request_type', new.request_type)
    );
  else
    insert into private.audit_events(actor_id, action, target_type, target_id, outcome, context)
    values (
      (select auth.uid()), 'organization_duplicate_review', tg_table_name, new.id, new.status,
      jsonb_build_object('primary_organization_id', new.primary_organization_id, 'possible_duplicate_organization_id', new.possible_duplicate_organization_id)
    );
  end if;
  return new;
end $$;
