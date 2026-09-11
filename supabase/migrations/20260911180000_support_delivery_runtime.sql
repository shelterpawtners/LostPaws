-- Issue #56: least-privilege Support OS delivery runtime.
-- This records delivery attempts for the existing privacy-minimized contract only.
-- It never reads or transports reporter identity, raw ticket content, or AI payloads;
-- it never changes ticket status, closes cases, or authorizes fixes.

create table private.support_delivery_attempts (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete restrict,
  notification_lane text not null check (notification_lane in ('immediate', 'daily_digest')),
  first_due_at timestamptz not null,
  lease_token uuid,
  lease_expires_at timestamptz,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  last_attempt_at timestamptz,
  delivered_at timestamptz,
  last_error_code text check (last_error_code in (
    'transport_unavailable',
    'transport_rejected',
    'transport_timeout',
    'transport_failed'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ticket_id, notification_lane, first_due_at)
);

comment on table private.support_delivery_attempts is
  'Private idempotency and retry ledger for privacy-minimized Support OS delivery candidates. It stores no reporter identity, ticket text, or provider response body.';

create index support_delivery_attempts_retry_idx
  on private.support_delivery_attempts (lease_expires_at)
  where delivered_at is null;

revoke all on table private.support_delivery_attempts from public, anon, authenticated;

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
    insert into private.support_delivery_attempts (
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
    on conflict (ticket_id, notification_lane, first_due_at) do update
      set lease_token = excluded.lease_token,
          lease_expires_at = excluded.lease_expires_at,
          attempt_count = private.support_delivery_attempts.attempt_count + 1,
          last_attempt_at = excluded.last_attempt_at,
          last_error_code = null,
          updated_at = excluded.updated_at
      where private.support_delivery_attempts.delivered_at is null
        and (
          private.support_delivery_attempts.lease_expires_at is null
          or private.support_delivery_attempts.lease_expires_at <= now()
        )
    returning
      id,
      lease_token,
      ticket_id,
      notification_lane,
      first_due_at
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

create or replace function public.complete_support_delivery_candidate(
  p_delivery_id uuid,
  p_lease_token uuid,
  p_delivery_succeeded boolean,
  p_error_code text default null
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
begin
  if p_delivery_succeeded and p_error_code is not null then
    raise exception 'successful delivery cannot include an error code' using errcode = '22023';
  end if;
  if not p_delivery_succeeded and (
    p_error_code is null or p_error_code not in (
      'transport_unavailable',
      'transport_rejected',
      'transport_timeout',
      'transport_failed'
    )
  ) then
    raise exception 'failed delivery requires a safe error code' using errcode = '22023';
  end if;

  update private.support_delivery_attempts
  set delivered_at = case when p_delivery_succeeded then now() else delivered_at end,
      lease_token = null,
      lease_expires_at = case when p_delivery_succeeded then null else now() end,
      last_error_code = case when p_delivery_succeeded then null else p_error_code end,
      updated_at = now()
  where id = p_delivery_id
    and lease_token = p_lease_token
    and delivered_at is null;

  return found;
end;
$$;

comment on function public.complete_support_delivery_candidate(uuid, uuid, boolean, text) is
  'Service-role-only completion interface. A failed delivery releases its lease for retry while recording only an allow-listed operational error code.';

revoke all on function public.claim_support_delivery_candidates(integer, integer) from public, anon, authenticated;
revoke all on function public.complete_support_delivery_candidate(uuid, uuid, boolean, text) from public, anon, authenticated;
grant execute on function public.claim_support_delivery_candidates(integer, integer) to service_role;
grant execute on function public.complete_support_delivery_candidate(uuid, uuid, boolean, text) to service_role;
