-- Track 2: Events as a first-class, cross-audience model.
-- See docs/product/DUAL-MARKETPLACE-RAVE-SHELTER-EXECUTION-PLAN.md section 5
-- and the schema-review proposal in section 18a.
--
-- Deliberately additive only: no existing table is altered. Modeled directly
-- on the established public.offers / public.organization_connections shapes
-- and the private.can_manage_org RLS pattern already used throughout the
-- schema, per the owner-confirmed design (2026-09-12):
--   - events.organization_id is nullable (community-run events allowed).
--   - event_participants.role has four values: attending, vending, hosting,
--     for_hire.
--   - events.audience uses pet / human / both (not offers' pet/rave/shared
--     spelling, since Events is a distinct concept from marketplace offers).

create table public.events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations on delete cascade,
  created_by uuid not null references public.profiles,
  audience text not null check (audience in ('pet', 'human', 'both')),
  category text not null,
  title text not null,
  summary text not null,
  details text,
  service_area text,
  is_online boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  status public.record_status not null default 'draft',
  published_at timestamptz,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create table public.event_participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events on delete cascade,
  organization_id uuid not null references public.organizations on delete cascade,
  role text not null check (role in ('attending', 'vending', 'hosting', 'for_hire')),
  status text not null default 'active' check (status in ('invited', 'active', 'revoked')),
  created_by uuid not null references public.profiles,
  created_at timestamptz not null default now(),
  unique (event_id, organization_id, role)
);

create index events_organization_idx on public.events (organization_id);
create index events_status_idx on public.events (status, published_at);
create index event_participants_event_idx on public.event_participants (event_id);
create index event_participants_organization_idx on public.event_participants (organization_id);

create trigger events_touch before update on public.events
  for each row execute function private.touch();

alter table public.events enable row level security;
alter table public.event_participants enable row level security;

-- Public read mirrors the established offer_read boundary: anon/authenticated
-- see published, non-demo, non-expired rows; an organization's own members see
-- their organization's rows regardless of status; a solo (organization-less)
-- event is visible to its creator regardless of status.
create policy events_read on public.events for select to anon, authenticated using (
  (status = 'active' and published_at is not null and (ends_at is null or ends_at > now()) and is_demo = false)
  or (organization_id is not null and private.can_manage_org(organization_id, array['owner', 'administrator', 'publisher', 'member']))
  or (organization_id is null and created_by = (select auth.uid()))
);

-- Insert: attribution is fixed to the creator, same as organizations.org_add.
create policy events_insert on public.events for insert to authenticated with check (
  created_by = (select auth.uid())
  and (organization_id is null or private.can_manage_org(organization_id, array['owner', 'administrator', 'publisher']))
);

-- Update: any qualifying manager of the owning organization may edit, not
-- only the original creator (same convention as organizations.org_edit) — an
-- organization-less event stays editable only by its original creator, since
-- there is no organization membership to check instead.
create policy events_update on public.events for update to authenticated using (
  (organization_id is not null and private.can_manage_org(organization_id, array['owner', 'administrator', 'publisher']))
  or (organization_id is null and created_by = (select auth.uid()))
) with check (
  (organization_id is not null and private.can_manage_org(organization_id, array['owner', 'administrator', 'publisher']))
  or (organization_id is null and created_by = (select auth.uid()))
);

-- No delete policy: retire an event by moving status to 'suspended' or
-- 'expired' (matching public.record_status), the same soft-lifecycle
-- convention public.organizations uses rather than hard deletes.

-- Participation rows are visible alongside their event: anyone who can see the
-- event (public read boundary above) can see who is participating, plus the
-- participating organization's own members.
create policy event_participants_read on public.event_participants for select to anon, authenticated using (
  exists (
    select 1 from public.events e
    where e.id = event_id
      and (
        (e.status = 'active' and e.published_at is not null and (e.ends_at is null or e.ends_at > now()) and e.is_demo = false)
        or (e.organization_id is not null and private.can_manage_org(e.organization_id, array['owner', 'administrator', 'publisher', 'member']))
        or (e.organization_id is null and e.created_by = (select auth.uid()))
      )
  )
  or private.can_manage_org(organization_id, array['owner', 'administrator', 'publisher', 'member'])
);

-- Only the participating organization's managers can add their own
-- organization's participation in an event; the event owner does not get to
-- unilaterally add other organizations as participants.
create policy event_participants_insert on public.event_participants for insert to authenticated with check (
  created_by = (select auth.uid())
  and private.can_manage_org(organization_id, array['owner', 'administrator', 'publisher'])
);

-- Update (e.g. revoking participation): any qualifying manager of the
-- participating organization, not only whoever originally added the row.
create policy event_participants_update on public.event_participants for update to authenticated using (
  private.can_manage_org(organization_id, array['owner', 'administrator', 'publisher'])
) with check (
  private.can_manage_org(organization_id, array['owner', 'administrator', 'publisher'])
);

-- No delete grant: matches the no-delete-policy design above (soft lifecycle
-- via status instead of hard deletes).
grant select, insert, update on public.events to authenticated;
grant select on public.events to anon;
grant select, insert, update on public.event_participants to authenticated;
grant select on public.event_participants to anon;
