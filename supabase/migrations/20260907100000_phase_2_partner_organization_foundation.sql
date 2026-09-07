-- Phase 2 Checkpoint 1: entry-first partner organization resolution.
-- Matching is assistive only; no request grants membership or ownership.

insert into public.organization_relationship_types(code,label,is_directional) values
  ('franchise_of','Independent franchise of',true),
  ('branded_as','Branded as',true)
on conflict(code) do update set label=excluded.label, is_directional=excluded.is_directional;

create table public.organization_onboarding_drafts (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null unique references public.profiles(id) on delete cascade,
  partner_kind text not null check (partner_kind in ('petbiz','rave_vendor')),
  status text not null default 'editing' check (status in ('editing','resolved_existing','resolved_new','abandoned')),
  form_data jsonb not null default '{}'::jsonb,
  resolved_organization_id uuid references public.organizations(id),
  resolution_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_candidate_dismissals (
  draft_id uuid not null references public.organization_onboarding_drafts(id) on delete cascade,
  organization_id uuid not null references public.organizations(id),
  dismissed_by uuid not null references public.profiles(id),
  reason text,
  created_at timestamptz not null default now(),
  primary key (draft_id, organization_id)
);

create table public.organization_access_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  requester_id uuid not null references public.profiles(id) on delete cascade,
  request_type text not null check (request_type in ('membership','ownership_claim')),
  status text not null default 'pending' check (status in ('pending','approved','declined','withdrawn','superseded')),
  requester_snapshot jsonb not null default '{}'::jsonb,
  reason text,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  resolution_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status in ('pending','withdrawn') and reviewed_by is null and reviewed_at is null) or status not in ('pending','withdrawn'))
);
create unique index organization_access_pending_unique
  on public.organization_access_requests(organization_id, requester_id, request_type)
  where status = 'pending';

create table public.organization_duplicate_review_cases (
  id uuid primary key default gen_random_uuid(),
  primary_organization_id uuid not null references public.organizations(id),
  possible_duplicate_organization_id uuid not null references public.organizations(id),
  status text not null default 'pending' check (status in ('pending','not_duplicate','deprecated','merged_reference_preserved')),
  reason text,
  created_by uuid not null references public.profiles(id),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  resolution_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (primary_organization_id <> possible_duplicate_organization_id)
);

create index organization_access_request_org_status_idx
  on public.organization_access_requests(organization_id, status, created_at desc);
create index organization_access_request_requester_idx
  on public.organization_access_requests(requester_id, created_at desc);
create index organization_duplicate_case_status_idx
  on public.organization_duplicate_review_cases(status, created_at desc);

create or replace function private.capture_organization_review_audit()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  insert into private.audit_events(actor_id, action, target_type, target_id, outcome, context)
  values (
    (select auth.uid()),
    case when tg_table_name = 'organization_access_requests' then 'organization_access_request' else 'organization_duplicate_review' end,
    tg_table_name,
    new.id,
    new.status,
    case when tg_table_name = 'organization_access_requests' then
      jsonb_build_object('organization_id', new.organization_id, 'request_type', new.request_type)
    else
      jsonb_build_object('primary_organization_id', new.primary_organization_id, 'possible_duplicate_organization_id', new.possible_duplicate_organization_id)
    end
  );
  return new;
end $$;
revoke all on function private.capture_organization_review_audit() from public, anon, authenticated;

create trigger organization_access_request_audit
after insert or update on public.organization_access_requests
for each row execute function private.capture_organization_review_audit();
create trigger organization_duplicate_review_audit
after insert or update on public.organization_duplicate_review_cases
for each row execute function private.capture_organization_review_audit();

create or replace function public.partner_organization_candidates(
  input_public_name text default null,
  input_legal_name text default null,
  input_website_url text default null,
  input_phone text default null,
  input_street_address text default null,
  input_city text default null,
  input_state_province text default null
)
returns table (
  organization_id uuid,
  public_name text,
  city text,
  state_province text,
  match_score integer,
  match_reasons text[]
)
language sql stable security definer set search_path='' as $$
  with input as (
    select
      regexp_replace(lower(coalesce(input_public_name, '')), '[^a-z0-9]+', '', 'g') as public_name_key,
      regexp_replace(lower(coalesce(input_legal_name, '')), '[^a-z0-9]+', '', 'g') as legal_name_key,
      lower(trim(coalesce(input_website_url, ''))) as website_key,
      regexp_replace(coalesce(input_phone, ''), '[^0-9]+', '', 'g') as phone_key,
      regexp_replace(lower(coalesce(input_street_address, '')), '[^a-z0-9]+', '', 'g') as street_key,
      lower(trim(coalesce(input_city, ''))) as city_key,
      lower(trim(coalesce(input_state_province, ''))) as state_key
  ), candidates as (
    select o.id, o.public_name, l.city, l.state_province,
      (case when i.website_key <> '' and lower(coalesce(o.website_url, '')) = i.website_key then 100 else 0 end) +
      (case when i.phone_key <> '' and regexp_replace(coalesce(o.public_phone, ''), '[^0-9]+', '', 'g') = i.phone_key then 80 else 0 end) +
      (case when i.public_name_key <> '' and regexp_replace(lower(o.public_name), '[^a-z0-9]+', '', 'g') = i.public_name_key then 45 else 0 end) +
      (case when i.legal_name_key <> '' and regexp_replace(lower(coalesce(o.legal_name, '')), '[^a-z0-9]+', '', 'g') = i.legal_name_key then 45 else 0 end) +
      (case when i.street_key <> '' and regexp_replace(lower(coalesce(l.street_address_1, '')), '[^a-z0-9]+', '', 'g') = i.street_key then 55 else 0 end) +
      (case when i.city_key <> '' and lower(coalesce(l.city, '')) = i.city_key then 5 else 0 end) +
      (case when i.state_key <> '' and lower(coalesce(l.state_province, '')) = i.state_key then 5 else 0 end) as match_score,
      array_remove(array[
        case when i.website_key <> '' and lower(coalesce(o.website_url, '')) = i.website_key then 'matching website' end,
        case when i.phone_key <> '' and regexp_replace(coalesce(o.public_phone, ''), '[^0-9]+', '', 'g') = i.phone_key then 'matching phone' end,
        case when i.public_name_key <> '' and regexp_replace(lower(o.public_name), '[^a-z0-9]+', '', 'g') = i.public_name_key then 'matching business name' end,
        case when i.legal_name_key <> '' and regexp_replace(lower(coalesce(o.legal_name, '')), '[^a-z0-9]+', '', 'g') = i.legal_name_key then 'matching legal or DBA name' end,
        case when i.street_key <> '' and regexp_replace(lower(coalesce(l.street_address_1, '')), '[^a-z0-9]+', '', 'g') = i.street_key then 'matching street address' end,
        case when i.city_key <> '' and lower(coalesce(l.city, '')) = i.city_key then 'same city' end
      ], null) as match_reasons
    from public.organizations o
    left join public.organization_locations l on l.organization_id = o.id and l.is_primary
    cross join input i
    where (select auth.uid()) is not null
      and o.status = 'active'
      and (
        (i.website_key <> '' and lower(coalesce(o.website_url, '')) = i.website_key)
        or (i.phone_key <> '' and regexp_replace(coalesce(o.public_phone, ''), '[^0-9]+', '', 'g') = i.phone_key)
        or (i.public_name_key <> '' and regexp_replace(lower(o.public_name), '[^a-z0-9]+', '', 'g') = i.public_name_key)
        or (i.legal_name_key <> '' and regexp_replace(lower(coalesce(o.legal_name, '')), '[^a-z0-9]+', '', 'g') = i.legal_name_key)
        or (i.street_key <> '' and regexp_replace(lower(coalesce(l.street_address_1, '')), '[^a-z0-9]+', '', 'g') = i.street_key)
      )
  )
  select id, public_name, city, state_province, match_score, match_reasons
  from candidates
  order by match_score desc, public_name
  limit 8
$$;
revoke all on function public.partner_organization_candidates(text,text,text,text,text,text,text) from public;
grant execute on function public.partner_organization_candidates(text,text,text,text,text,text,text) to authenticated;

alter table public.organization_onboarding_drafts enable row level security;
alter table public.organization_candidate_dismissals enable row level security;
alter table public.organization_access_requests enable row level security;
alter table public.organization_duplicate_review_cases enable row level security;

create policy onboarding_drafts_own on public.organization_onboarding_drafts
for all to authenticated
using (created_by = (select auth.uid()))
with check (created_by = (select auth.uid()));
create policy candidate_dismissals_own on public.organization_candidate_dismissals
for all to authenticated
using (dismissed_by = (select auth.uid()) and exists(select 1 from public.organization_onboarding_drafts d where d.id = draft_id and d.created_by = (select auth.uid())))
with check (dismissed_by = (select auth.uid()) and exists(select 1 from public.organization_onboarding_drafts d where d.id = draft_id and d.created_by = (select auth.uid())));
create policy access_request_requester_read on public.organization_access_requests
for select to authenticated using (requester_id = (select auth.uid()));
create policy access_request_org_manager_read on public.organization_access_requests
for select to authenticated using (private.can_manage_org(organization_id, array['owner','administrator']));
create policy access_request_requester_add on public.organization_access_requests
for insert to authenticated with check (requester_id = (select auth.uid()) and status = 'pending' and reviewed_by is null and reviewed_at is null);
create policy access_request_requester_withdraw on public.organization_access_requests
for update to authenticated
using (requester_id = (select auth.uid()) and status = 'pending')
with check (requester_id = (select auth.uid()) and status = 'withdrawn' and reviewed_by is null and reviewed_at is null);
create policy access_request_platform_manage on public.organization_access_requests
for all to authenticated using (private.is_platform_admin()) with check (private.is_platform_admin());
create policy duplicate_review_platform_manage on public.organization_duplicate_review_cases
for all to authenticated using (private.is_platform_admin()) with check (private.is_platform_admin());

drop policy if exists org_add on public.organizations;
create policy org_add on public.organizations for insert to authenticated
with check (
  created_by = (select auth.uid())
  and verified_at is null
  and (parent_organization_id is null or private.can_manage_org(parent_organization_id, array['owner','administrator']))
);
drop policy if exists org_edit on public.organizations;
create policy org_edit on public.organizations for update to authenticated
using (created_by = (select auth.uid()) or private.can_manage_org(id, array['owner','administrator']))
with check (
  (created_by = (select auth.uid()) or private.can_manage_org(id, array['owner','administrator']))
  and (parent_organization_id is null or private.can_manage_org(parent_organization_id, array['owner','administrator']))
);

grant select, insert, update, delete on public.organization_onboarding_drafts, public.organization_candidate_dismissals, public.organization_access_requests, public.organization_duplicate_review_cases to authenticated;
