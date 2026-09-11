-- Issue #56: privacy-safe Support OS delivery contract and cross-day aging.
-- This view is an advisory provider-neutral contract only. It does not schedule jobs,
-- send notifications, mutate tickets, auto-close reports, or authorize code/data changes.
-- A future least-privilege scheduler/delivery worker may consume only these minimized fields.

create or replace view private.support_delivery_candidates
with (security_invoker = true)
as
select
  c.ticket_id,
  c.reference_code,
  c.category,
  c.severity,
  c.status,
  c.classification_bucket,
  c.notification_lane,
  c.recommended_action,
  c.human_review_required,
  c.created_at,
  c.updated_at,
  case
    when c.notification_lane = 'immediate' then c.created_at
    else date_trunc('day', c.created_at) + interval '1 day'
  end as first_due_at,
  case
    when c.notification_lane = 'immediate' then true
    else now() >= date_trunc('day', c.created_at) + interval '1 day'
  end as is_due,
  greatest(0, floor(extract(epoch from (now() - c.created_at)) / 86400))::integer as age_days,
  case
    when c.created_at <= now() - interval '7 days' then 'stale_7d_plus'
    when c.created_at <= now() - interval '48 hours' then 'aging_48h_plus'
    when c.created_at <= now() - interval '24 hours' then 'carried_over_24h_plus'
    else 'new_under_24h'
  end as aging_band,
  case
    when c.human_review_required then true
    when c.category = 'privacy_safety' or c.severity in ('p0', 'p1') then true
    when c.created_at <= now() - interval '48 hours' then true
    else false
  end as escalation_required
from private.support_triage_classification c;

comment on view private.support_delivery_candidates is
  'Privacy-minimized provider-neutral Support OS delivery contract. Contains no reporter identity or raw ticket text; does not schedule, send, mutate, close, fix, or authorize destructive/security-sensitive actions.';

revoke all on private.support_delivery_candidates from public, anon, authenticated;
