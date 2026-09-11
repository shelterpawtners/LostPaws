-- Issue #116: fix PL/pgSQL ambiguity in Support OS delivery claim runtime.
-- Preserve service-role-only execution, privacy minimization, lease/retry behavior,
-- and idempotent delivery semantics.

create or replace function public.claim_support_delivery_candidates(
  p_limit integer default 25,
  p_lease_seconds integer default 300
)
returns table (
  delivery_id uuid,
  lease_token uuid,
  ticket_id uuid,
  reference_code text,
  category text,
  severity text,
  status text,
  classification_bucket text,
  notification_lane text,
  recommended_action text,
  human_review_required boolean,
  created_at timestamptz,
  updated_at timestamptz,
  first_due_at timestamptz,
  age_days integer,
  aging_band text,
  escalation_required boolean
)
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
begin
  if p_limit < 1 or p_limit > 50 then
    raise exception 'p_limit must be between 1 and 50' using errcode = '22023';
  end if;
  if p_lease_seconds < 60 or p_lease_seconds > 900 then
    raise exception 'p_lease_seconds must be between 60 and 900' using errcode = '22023';
  end if;

  return query
  with candidates as (
    select c.*
    from private.support_delivery_candidates c
    left join private.support_delivery_attempts a
      on a.ticket_id = c.ticket_id
      and a.notification_lane = c.notification_lane
      and a.first_due_at = c.first_due_at
    where c.is_due
      and a.delivered_at is null
      and (a.lease_expires_at is null or a.lease_expires_at <= now())
    order by c.escalation_required desc, c.first_due_at asc, c.ticket_id
    limit p_limit
  ), claimed as (
    insert into private.support_delivery_attempts as delivery_attempt (
      ticket_id,
      notification_lane,
      first_due_at,
      lease_token,
      lease_expires_at,
      attempt_count,
      last_attempt_at,
      last_error_code,
      updated_at
    )
    select
      c.ticket_id,
      c.notification_lane,
      c.first_due_at,
      gen_random_uuid(),
      now() + make_interval(secs => p_lease_seconds),
      1,
      now(),
      null,
      now()
    from candidates c
    on conflict on constraint support_delivery_attempts_ticket_id_notification_lane_first_key do update
      set lease_token = excluded.lease_token,
          lease_expires_at = excluded.lease_expires_at,
          attempt_count = delivery_attempt.attempt_count + 1,
          last_attempt_at = excluded.last_attempt_at,
          last_error_code = null,
          updated_at = excluded.updated_at
      where delivery_attempt.delivered_at is null
        and (
          delivery_attempt.lease_expires_at is null
          or delivery_attempt.lease_expires_at <= now()
        )
    returning
      delivery_attempt.id,
      delivery_attempt.lease_token,
      delivery_attempt.ticket_id,
      delivery_attempt.notification_lane,
      delivery_attempt.first_due_at
  )
  select
    a.id,
    a.lease_token,
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
    c.first_due_at,
    c.age_days,
    c.aging_band,
    c.escalation_required
  from claimed a
  join private.support_delivery_candidates c
    on c.ticket_id = a.ticket_id
    and c.notification_lane = a.notification_lane
    and c.first_due_at = a.first_due_at;
end;
$$;

comment on function public.claim_support_delivery_candidates(integer, integer) is
  'Service-role-only claim interface for the privacy-minimized Support OS delivery contract. Claims are leased, bounded, retryable, and never expose reporter identity or raw ticket content.';

revoke all on function public.claim_support_delivery_candidates(integer, integer) from public, anon, authenticated;
grant execute on function public.claim_support_delivery_candidates(integer, integer) to service_role;
