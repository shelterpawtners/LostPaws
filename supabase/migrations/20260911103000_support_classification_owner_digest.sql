-- Privacy-safe Support OS routing classification and owner digest.
-- These views are advisory only. They do not mutate tickets, auto-close reports,
-- authorize code/data changes, or expose raw ticket text/reporter identity.

create or replace view private.support_triage_classification
with (security_invoker = true)
as
select
  q.ticket_id,
  q.reference_code,
  q.category,
  q.severity,
  q.status,
  q.app_route,
  q.created_at,
  q.updated_at,
  q.human_review_required,
  q.duplicate_candidate_count,
  q.recommended_action,
  case
    when q.category = 'privacy_safety' or q.severity = 'p0' then 'owner_immediate'
    when q.severity = 'p1' then 'owner_urgent'
    when q.category = 'account_auth' then 'owner_review'
    when q.category = 'bug' then 'engineering_triage'
    when q.category in ('marketplace_offer', 'adoption_verification') then 'workflow_triage'
    when q.category in ('suggestion', 'ui_accessibility') then 'product_review'
    else 'routine_review'
  end as classification_bucket,
  case
    when q.category = 'privacy_safety' or q.severity in ('p0', 'p1') then 'immediate'
    else 'daily_digest'
  end as notification_lane
from private.support_triage_queue q;

revoke all on private.support_triage_classification from public, anon, authenticated;

create or replace view private.support_owner_digest
with (security_invoker = true)
as
select
  classification_bucket,
  notification_lane,
  category,
  severity,
  recommended_action,
  count(*) as ticket_count,
  count(*) filter (where human_review_required) as human_review_count,
  min(created_at) as oldest_created_at,
  max(updated_at) as newest_updated_at,
  max(duplicate_candidate_count) as max_duplicate_candidate_count
from private.support_triage_classification
group by
  classification_bucket,
  notification_lane,
  category,
  severity,
  recommended_action;

revoke all on private.support_owner_digest from public, anon, authenticated;
