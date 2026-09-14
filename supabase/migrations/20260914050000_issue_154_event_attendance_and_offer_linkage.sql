-- Issue #154: individual event attendance, event-scoped Marketplace
-- filtering, and a safe attendee-to-vendor contact path.
--
-- event_participants (existing, Track 2) is organization-scoped only —
-- attending/vending/hosting/for_hire rows are added by an organization's
-- managers, not by an individual Guardian marking themselves as going. This
-- adds a small, separate individual-attendance table rather than relaxing
-- event_participants' organization_id/RLS, so the existing vendor
-- participation semantics and unique constraint are untouched.
--
-- Attendance rows are intentionally not readable by other users: only an
-- aggregate count is exposed publicly (event_attendance_count), never the
-- underlying rows, so this cannot become a public attendee directory with
-- PII per the issue's explicit requirement.

create table public.event_attendees (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  status text not null default 'attending' check (status in ('attending', 'not_attending')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create index event_attendees_event_idx on public.event_attendees (event_id);

create trigger event_attendees_touch before update on public.event_attendees
  for each row execute function private.touch();

alter table public.event_attendees enable row level security;

-- A user may only read/write their own attendance row. No policy grants
-- visibility into another user's row, by design.
create policy event_attendees_own_read on public.event_attendees for select to authenticated using (
  user_id = (select auth.uid())
);

create policy event_attendees_own_insert on public.event_attendees for insert to authenticated with check (
  user_id = (select auth.uid())
);

create policy event_attendees_own_update on public.event_attendees for update to authenticated using (
  user_id = (select auth.uid())
) with check (
  user_id = (select auth.uid())
);

-- No delete policy: toggle status to 'not_attending' instead of deleting,
-- matching this schema's existing soft-lifecycle convention.
grant select, insert, update on public.event_attendees to authenticated;

-- Public aggregate only — never the rows themselves.
create function public.event_attendance_count(p_event_id uuid)
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)
  from public.event_attendees a
  join public.events e on e.id = a.event_id
  where a.event_id = p_event_id
    and a.status = 'attending'
    and e.status = 'active'
    and e.published_at is not null
    and (e.ends_at is null or e.ends_at > now())
    and e.is_demo = false
$$;

revoke all on function public.event_attendance_count(uuid) from public;
grant execute on function public.event_attendance_count(uuid) to anon, authenticated;

-- Safe attendee-to-vendor contact path: expose only the already-public
-- business fields (same columns public_partner_profile_details already
-- surfaces) for organizations participating in a genuinely public event,
-- never attendee data. This is intentionally its own small function rather
-- than widening event_participants RLS or organizations' anon read grant.
create function public.event_participant_organizations(p_event_id uuid)
returns table(
  organization_id uuid,
  public_name text,
  role text,
  website_url text,
  public_email text,
  public_phone text
)
language sql
stable
security definer
set search_path = ''
as $$
  select o.id, o.public_name, ep.role, o.website_url, o.public_email, o.public_phone
  from public.event_participants ep
  join public.organizations o on o.id = ep.organization_id
  join public.events e on e.id = ep.event_id
  where ep.event_id = p_event_id
    and ep.status = 'active'
    and e.status = 'active'
    and e.published_at is not null
    and (e.ends_at is null or e.ends_at > now())
    and e.is_demo = false
  order by ep.role, o.public_name
$$;

revoke all on function public.event_participant_organizations(uuid) from public;
grant execute on function public.event_participant_organizations(uuid) to anon, authenticated;

-- Event-specific Marketplace filtering: a nullable link from an offer to the
-- single event it is intended for. Deliberately on public.offers (not a join
-- table) since an offer created "for an event" describes that offer, not a
-- many-to-many relationship the product currently needs.
alter table public.offers
  add column if not exists event_id uuid references public.events on delete set null;

create index if not exists offers_event_idx on public.offers (event_id);

-- Extend public_active_offers with an optional event filter, composing with
-- the existing organization/channel filters rather than forking the
-- function. Return shape is unchanged.
drop function if exists public.public_active_offers(uuid, public.market_channel);

create function public.public_active_offers(
  p_organization_id uuid default null,
  p_channel public.market_channel default null,
  p_event_id uuid default null
)
returns table(
  offer_id uuid,
  organization_id uuid,
  business_name text,
  version_id uuid,
  title text,
  summary text,
  details text,
  terms text,
  classification text,
  channel public.market_channel,
  category text,
  image_url text,
  destination_url text,
  eligibility text,
  last_verified_at timestamptz,
  eligibility_kind text,
  starts_at timestamptz,
  ends_at timestamptz,
  redemption_instructions text,
  source_url text,
  disclosure text,
  applicability text[],
  event_id uuid
)
language sql
stable
security definer
set search_path=''
as $$
  select
    o.id,
    o.organization_id,
    g.public_name,
    v.id,
    v.title,
    v.summary,
    v.details,
    v.terms,
    o.classification,
    o.channel,
    o.category,
    case when o.image_confirmed_at is not null then o.image_url else null end,
    o.destination_url,
    o.eligibility,
    o.last_verified_at,
    v.eligibility_kind,
    v.starts_at,
    v.ends_at,
    v.redemption_instructions,
    v.source_url,
    v.disclosure,
    array(
      select ol.applicability
      from public.offer_locations ol
      where ol.offer_version_id = v.id
      order by ol.applicability
    ),
    o.event_id
  from public.offers o
  join public.offer_versions v on v.id = o.current_version_id
  join public.organizations g on g.id = o.organization_id
  where o.status = 'active'
    and v.status = 'published'
    and (v.starts_at is null or v.starts_at <= now())
    and (v.ends_at is null or v.ends_at > now())
    and o.classification not in ('internal', 'reference')
    and o.is_demo = false
    and g.is_demo = false
    and (p_organization_id is null or o.organization_id = p_organization_id)
    and (p_channel is null or o.channel = p_channel or o.channel = 'shared')
    and (p_event_id is null or o.event_id = p_event_id)
$$;

revoke all on function public.public_active_offers(uuid, public.market_channel, uuid) from public;
grant execute on function public.public_active_offers(uuid, public.market_channel, uuid) to anon, authenticated;

-- Let a vendor attach a new/revised offer to a specific event. Both RPCs
-- already take the whole form as a jsonb blob; this only adds one more key,
-- validated the same way create_partner_offer already validates its caller
-- (assert_offer_manager / can_manage_org), so no new authorization surface.
create or replace function public.create_partner_offer(p_organization_id uuid, p_terms jsonb) returns uuid
language plpgsql security definer set search_path='' as $$
declare o uuid:=gen_random_uuid(); v uuid:=gen_random_uuid();
begin
  if not private.can_manage_org(p_organization_id,array['owner','administrator','publisher']) then raise exception 'Not authorized' using errcode='42501'; end if;
  if coalesce(trim(p_terms->>'title'),'')='' or coalesce(trim(p_terms->>'summary'),'')='' then raise exception 'Title and summary are required'; end if;
  insert into public.offers(id,organization_id,created_by,channel,title,summary,details,category,classification,destination_url,eligibility,redemption_instructions,starts_at,expires_at,status,is_demo,current_version_id,event_id)
  values(o,p_organization_id,auth.uid(),coalesce((p_terms->>'channel')::public.market_channel,'pet'),p_terms->>'title',p_terms->>'summary',p_terms->>'details',coalesce(p_terms->>'category','General'),coalesce(p_terms->>'classification','partner_published'),nullif(p_terms->>'source_url',''),p_terms->>'eligibility_kind',p_terms->>'redemption_instructions',nullif(p_terms->>'starts_at','')::timestamptz,nullif(p_terms->>'ends_at','')::timestamptz,'draft',false,null,nullif(p_terms->>'event_id','')::uuid);
  insert into public.offer_versions(id,offer_id,version_number,title,summary,details,terms,starts_at,ends_at,availability_limit,status,created_by,eligibility_kind,claim_window_days,per_user_limit,per_pet_limit,redemption_instructions,source_url,disclosure)
  values(v,o,1,p_terms->>'title',p_terms->>'summary',p_terms->>'details',p_terms->>'terms',nullif(p_terms->>'starts_at','')::timestamptz,nullif(p_terms->>'ends_at','')::timestamptz,nullif(p_terms->>'availability_limit','')::integer,'draft',auth.uid(),coalesce(p_terms->>'eligibility_kind','all_pets'),coalesce(nullif(p_terms->>'claim_window_days','')::integer,30),nullif(p_terms->>'per_user_limit','')::integer,nullif(p_terms->>'per_pet_limit','')::integer,p_terms->>'redemption_instructions',nullif(p_terms->>'source_url',''),p_terms->>'disclosure');
  insert into public.offer_locations(offer_version_id,applicability) values(v,coalesce(p_terms->>'applicability','online'));
  update public.offers set current_version_id=v where id=o;
  insert into private.audit_events(actor_id,action,target_type,target_id,outcome) values(auth.uid(),'offer.create','offer',o,'success');
  return o;
end $$;

create or replace function public.revise_partner_offer(p_offer_id uuid, p_terms jsonb) returns uuid
language plpgsql security definer set search_path='' as $$
declare o public.offers; v uuid:=gen_random_uuid(); n integer;
begin
  o:=private.assert_offer_manager(p_offer_id);
  if coalesce(trim(p_terms->>'title'),'')='' or coalesce(trim(p_terms->>'summary'),'')='' then raise exception 'Title and summary are required'; end if;
  select coalesce(max(version_number),0)+1 into n from public.offer_versions where offer_id=p_offer_id;
  insert into public.offer_versions(id,offer_id,version_number,title,summary,details,terms,starts_at,ends_at,availability_limit,status,created_by,eligibility_kind,claim_window_days,per_user_limit,per_pet_limit,redemption_instructions,source_url,disclosure)
  values(v,p_offer_id,n,p_terms->>'title',p_terms->>'summary',p_terms->>'details',p_terms->>'terms',nullif(p_terms->>'starts_at','')::timestamptz,nullif(p_terms->>'ends_at','')::timestamptz,nullif(p_terms->>'availability_limit','')::integer,'draft',auth.uid(),coalesce(p_terms->>'eligibility_kind','all_pets'),coalesce(nullif(p_terms->>'claim_window_days','')::integer,30),nullif(p_terms->>'per_user_limit','')::integer,nullif(p_terms->>'per_pet_limit','')::integer,p_terms->>'redemption_instructions',nullif(p_terms->>'source_url',''),p_terms->>'disclosure');
  insert into public.offer_locations(offer_version_id,applicability) values(v,coalesce(p_terms->>'applicability','online'));
  update public.offers set current_version_id=v,title=p_terms->>'title',summary=p_terms->>'summary',details=p_terms->>'details',event_id=nullif(p_terms->>'event_id','')::uuid,updated_at=now() where id=p_offer_id;
  return v;
end $$;

create or replace function public.duplicate_partner_offer(p_offer_id uuid) returns uuid
language plpgsql security definer set search_path='' as $$
declare o public.offers; v public.offer_versions;
begin
  o:=private.assert_offer_manager(p_offer_id); select * into v from public.offer_versions where id=o.current_version_id;
  return public.create_partner_offer(o.organization_id,jsonb_build_object('title',v.title||' (copy)','summary',v.summary,'details',v.details,'terms',v.terms,'channel',o.channel,'category',o.category,'classification',o.classification,'starts_at',v.starts_at,'ends_at',v.ends_at,'availability_limit',v.availability_limit,'eligibility_kind',v.eligibility_kind,'claim_window_days',v.claim_window_days,'per_user_limit',v.per_user_limit,'per_pet_limit',v.per_pet_limit,'redemption_instructions',v.redemption_instructions,'source_url',v.source_url,'disclosure',v.disclosure,'applicability',(select ol.applicability from public.offer_locations ol where ol.offer_version_id=v.id order by ol.id limit 1),'event_id',o.event_id));
end $$;
