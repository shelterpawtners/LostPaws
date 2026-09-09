-- Defense in depth for the non-exposed audit store.
-- No browser-facing policies are intentionally defined.
alter table private.audit_events enable row level security;
revoke all on table private.audit_events from anon, authenticated;
