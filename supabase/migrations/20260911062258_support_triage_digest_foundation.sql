-- Issue #56: bounded duplicate/digest plumbing for the MVP Support OS.
-- Raw user text remains in support_tickets under existing RLS; these private views expose aggregates only.

-- Reporter-created tickets must not be able to self-assign an internal duplicate group.
drop policy if exists support_ticket_reporter_insert on public.support_tickets;
create policy support_ticket_reporter_insert
on public.support_tickets for insert to authenticated
with check (
  reporter_id = (select auth.uid())
  and severity = 'p3'
  and status = 'new'
  and duplicate_group_key is null
  and human_review_required = false
  and github_issue_number is null
  and resolution_summary is null
  and resolved_at is null
  and closed_at is null
  and ai_triage = '{}'::jsonb
);

-- Deterministic, non-security fingerprint for support triage/deduplication.
-- This is intentionally a helper for grouping evidence, not authority to close or auto-fix a ticket.
create or replace function private.support_ticket_fingerprint(
  p_category text,
  p_app_route text,
  p_subject text
)
returns text
language sql
immutable
as $$
  select md5(
    lower(coalesce(p_category, '')) || '|' ||
    lower(trim(coalesce(p_app_route, ''))) || '|' ||
    lower(regexp_replace(trim(coalesce(p_subject, '')), '[[:space:]]+', ' ', 'g'))
  )
$$;

comment on function private.support_ticket_fingerprint(text,text,text) is
  'Deterministic support triage grouping helper only; never sufficient evidence to auto-close or auto-fix a ticket.';

-- Privacy-safe duplicate candidate queue. No reporter id, subject, description, or message body is exposed.
create or replace view private.support_duplicate_candidates
with (security_invoker = true)
as
select
  private.support_ticket_fingerprint(category, app_route, subject) as fingerprint,
  category,
  coalesce(app_route, '') as app_route,
  count(*)::bigint as ticket_count,
  min(created_at) as first_seen_at,
  max(created_at) as last_seen_at,
  count(*) filter (where human_review_required)::bigint as human_review_count
from public.support_tickets
where status not in ('resolved', 'closed')
group by 1, 2, 3
having count(*) > 1;

comment on view private.support_duplicate_candidates is
  'Aggregate duplicate candidates for support triage; intentionally excludes raw ticket text and reporter identity.';

-- Daily exception/digest source for a one-person operator. No raw ticket text or reporter identity is exposed.
create or replace view private.support_daily_digest
with (security_invoker = true)
as
select
  date_trunc('day', created_at) as day,
  category,
  severity,
  status,
  count(*)::bigint as ticket_count,
  count(*) filter (where human_review_required)::bigint as human_review_count,
  count(*) filter (
    where status not in ('resolved', 'closed')
      and created_at < now() - interval '24 hours'
  )::bigint as aging_over_24h_count,
  min(created_at) filter (where status not in ('resolved', 'closed')) as oldest_unresolved_at
from public.support_tickets
group by 1, 2, 3, 4;

comment on view private.support_daily_digest is
  'Privacy-safe aggregate source for daily support review and aging exceptions; excludes raw ticket text and reporter identity.';

revoke all on private.support_duplicate_candidates from anon, authenticated;
revoke all on private.support_daily_digest from anon, authenticated;
