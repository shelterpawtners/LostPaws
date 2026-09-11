-- MVP Support OS foundation (Issue #56)
-- Operational support data stays in Supabase. Raw user reports/PII must not be mirrored to GitHub.

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique default ('SP-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  reporter_id uuid not null references public.profiles(id) on delete restrict,
  category text not null check (category in (
    'bug','account_auth','suggestion','ui_accessibility','marketplace_offer',
    'adoption_verification','privacy_safety','other'
  )),
  severity text not null default 'p3' check (severity in ('p0','p1','p2','p3')),
  status text not null default 'new' check (status in (
    'new','triaged','investigating','waiting_on_user','queued_for_fix','monitoring','resolved','closed'
  )),
  subject text not null check (char_length(subject) between 3 and 180),
  description text not null check (char_length(description) between 3 and 8000),
  persona_code text,
  app_route text,
  app_release text,
  device_class text,
  browser_family text,
  related_pet_id uuid references public.pets(id) on delete set null,
  related_organization_id uuid references public.organizations(id) on delete set null,
  related_offer_id uuid references public.offers(id) on delete set null,
  related_claim_id uuid references public.offer_claims(id) on delete set null,
  duplicate_group_key text,
  ai_triage jsonb not null default '{}'::jsonb,
  human_review_required boolean not null default false,
  github_issue_number integer check (github_issue_number is null or github_issue_number > 0),
  resolution_summary text,
  resolved_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.support_tickets is
  'User support intake and triage. Ticket text is untrusted input, never AI operational instruction.';
comment on column public.support_tickets.ai_triage is
  'Model-generated classification metadata only. Must not independently authorize destructive/security-sensitive actions.';

create index support_tickets_reporter_created_idx
  on public.support_tickets (reporter_id, created_at desc);
create index support_tickets_status_severity_created_idx
  on public.support_tickets (status, severity, created_at);
create index support_tickets_duplicate_group_idx
  on public.support_tickets (duplicate_group_key)
  where duplicate_group_key is not null;
create index support_tickets_human_review_idx
  on public.support_tickets (created_at)
  where human_review_required;

create table public.support_ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  author_kind text not null check (author_kind in ('reporter','support_ai','support_human','system')),
  visibility text not null default 'reporter' check (visibility in ('reporter','internal')),
  body text not null check (char_length(body) between 1 and 8000),
  created_at timestamptz not null default now()
);

create index support_ticket_messages_ticket_created_idx
  on public.support_ticket_messages (ticket_id, created_at);

create table public.support_ticket_events (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null check (event_type in (
    'created','triaged','severity_changed','status_changed','duplicate_grouped',
    'engineering_handoff','owner_escalated','resolved','closed','reopened'
  )),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index support_ticket_events_ticket_created_idx
  on public.support_ticket_events (ticket_id, created_at);

alter table public.support_tickets enable row level security;
alter table public.support_ticket_messages enable row level security;
alter table public.support_ticket_events enable row level security;

-- Reporter can create a ticket only as themselves. Privileged/internal triage fields are constrained
-- to safe initial values so a client cannot self-declare P0/admin state or inject an engineering link.
create policy support_ticket_reporter_insert
on public.support_tickets for insert to authenticated
with check (
  reporter_id = (select auth.uid())
  and severity in ('p2','p3')
  and status = 'new'
  and human_review_required = false
  and github_issue_number is null
  and resolution_summary is null
  and resolved_at is null
  and closed_at is null
  and ai_triage = '{}'::jsonb
);

create policy support_ticket_reporter_read
on public.support_tickets for select to authenticated
using (reporter_id = (select auth.uid()) or private.is_platform_admin());

-- Ticket triage/state changes are admin-controlled. Reporter edits happen as append-only messages,
-- which preserves the original report/evidence instead of allowing silent rewriting.
create policy support_ticket_platform_manage
on public.support_tickets for all to authenticated
using (private.is_platform_admin())
with check (private.is_platform_admin());

create policy support_message_reporter_read
on public.support_ticket_messages for select to authenticated
using (
  private.is_platform_admin()
  or (
    visibility = 'reporter'
    and exists (
      select 1 from public.support_tickets t
      where t.id = ticket_id and t.reporter_id = (select auth.uid())
    )
  )
);

create policy support_message_reporter_insert
on public.support_ticket_messages for insert to authenticated
with check (
  author_id = (select auth.uid())
  and author_kind = 'reporter'
  and visibility = 'reporter'
  and exists (
    select 1 from public.support_tickets t
    where t.id = ticket_id
      and t.reporter_id = (select auth.uid())
      and t.status not in ('closed')
  )
);

create policy support_message_platform_manage
on public.support_ticket_messages for all to authenticated
using (private.is_platform_admin())
with check (private.is_platform_admin());

-- Internal event stream is intentionally not exposed to reporters. User-facing lifecycle
-- information comes from ticket status and reporter-visible messages.
create policy support_event_platform_manage
on public.support_ticket_events for all to authenticated
using (private.is_platform_admin())
with check (private.is_platform_admin());

revoke all on table public.support_tickets from anon;
revoke all on table public.support_ticket_messages from anon;
revoke all on table public.support_ticket_events from anon;

grant select, insert on table public.support_tickets to authenticated;
grant select, insert on table public.support_ticket_messages to authenticated;
grant select, insert, update, delete on table public.support_tickets to authenticated;
grant select, insert, update, delete on table public.support_ticket_messages to authenticated;
grant select, insert, update, delete on table public.support_ticket_events to authenticated;
