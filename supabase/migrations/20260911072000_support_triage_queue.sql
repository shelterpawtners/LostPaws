-- Issue #56: privacy-safe support triage queue.
-- This remains advisory only: it does not mutate tickets, auto-close reports,
-- or authorize destructive/security-sensitive actions.

create or replace view private.support_triage_queue
with (security_invoker = true)
as
with open_tickets as (
  select
    t.id,
    t.reference_code,
    t.category,
    t.severity,
    t.status,
    coalesce(t.app_route, '') as app_route,
    t.created_at,
    t.updated_at,
    t.human_review_required,
    private.support_ticket_fingerprint(t.category, t.app_route, t.subject) as fingerprint
  from public.support_tickets t
  where t.status not in ('resolved', 'closed')
),
duplicate_counts as (
  select fingerprint, ticket_count
  from private.support_duplicate_candidates
)
select
  o.id as ticket_id,
  o.reference_code,
  o.category,
  o.severity,
  o.status,
  o.app_route,
  o.created_at,
  o.updated_at,
  o.human_review_required,
  coalesce(d.ticket_count, 1::bigint) as duplicate_candidate_count,
  case
    when o.category = 'privacy_safety' then 'human_escalation'
    when o.category = 'account_auth' then 'human_review'
    when o.human_review_required then 'human_review'
    when o.created_at < now() - interval '48 hours' then 'aging_review'
    when coalesce(d.ticket_count, 1) > 1 then 'duplicate_review'
    else 'routine_triage'
  end as recommended_action,
  case
    when o.category = 'privacy_safety' then 100
    when o.severity = 'p0' then 95
    when o.severity = 'p1' then 85
    when o.human_review_required then 80
    when o.category = 'account_auth' then 75
    when o.created_at < now() - interval '48 hours' then 60
    when coalesce(d.ticket_count, 1) > 1 then 50
    else 10
  end as priority_score
from open_tickets o
left join duplicate_counts d using (fingerprint);

comment on view private.support_triage_queue is
  'Privacy-minimized advisory support triage queue. Contains no reporter identity or raw ticket text and never authorizes automatic closure, code changes, or destructive/security-sensitive actions.';

revoke all on private.support_triage_queue from anon, authenticated;
