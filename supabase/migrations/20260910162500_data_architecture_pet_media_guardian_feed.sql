-- Data Architecture Slice 1: multi-photo Pet Passport + Guardian activity timeline.
-- Additive only. Canonical claim/redemption truth remains in existing economic tables.

create table public.pet_media (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  media_type text not null default 'image' check (media_type in ('image','video')),
  storage_bucket text,
  storage_path text,
  external_url text,
  external_permalink text,
  source_system_id uuid references public.source_systems(id),
  external_media_id text,
  caption text check (caption is null or char_length(caption) <= 1000),
  alt_text text check (alt_text is null or char_length(alt_text) <= 500),
  sort_order integer not null default 0 check (sort_order >= 0),
  is_primary boolean not null default false,
  visibility text not null default 'private' check (visibility in ('private','care_team','public')),
  provenance_code text not null default 'guardian_entered' references public.provenance_types(code),
  captured_at timestamptz,
  imported_at timestamptz,
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (storage_path is not null and storage_bucket is not null)
    or external_url is not null
  )
);

create index pet_media_pet_order_idx
  on public.pet_media(pet_id,status,sort_order,created_at);
create unique index pet_media_storage_unique
  on public.pet_media(pet_id,storage_bucket,storage_path)
  where storage_path is not null;
create unique index pet_media_external_unique
  on public.pet_media(source_system_id,external_media_id)
  where source_system_id is not null and external_media_id is not null;
create unique index pet_media_one_primary_idx
  on public.pet_media(pet_id)
  where is_primary and status='active';

create trigger pet_media_touch
before update on public.pet_media
for each row execute function private.touch();

alter table public.pet_media enable row level security;

create policy pet_media_active_guardian_read
on public.pet_media for select to authenticated
using (
  exists (
    select 1
    from public.guardianships g
    where g.pet_id=pet_media.pet_id
      and g.guardian_id=(select auth.uid())
      and g.status='active'
      and g.ended_at is null
  )
);

create policy pet_media_primary_guardian_insert
on public.pet_media for insert to authenticated
with check (
  created_by=(select auth.uid())
  and exists (
    select 1
    from public.guardianships g
    where g.pet_id=pet_media.pet_id
      and g.guardian_id=(select auth.uid())
      and g.relationship='primary'
      and g.status='active'
      and g.ended_at is null
  )
);

create policy pet_media_primary_guardian_update
on public.pet_media for update to authenticated
using (
  exists (
    select 1
    from public.guardianships g
    where g.pet_id=pet_media.pet_id
      and g.guardian_id=(select auth.uid())
      and g.relationship='primary'
      and g.status='active'
      and g.ended_at is null
  )
)
with check (
  exists (
    select 1
    from public.guardianships g
    where g.pet_id=pet_media.pet_id
      and g.guardian_id=(select auth.uid())
      and g.relationship='primary'
      and g.status='active'
      and g.ended_at is null
  )
);

revoke all on public.pet_media from public,anon,authenticated;
grant select,insert,update on public.pet_media to authenticated;

-- Preserve legacy single-photo pointers without deleting or mutating them.
insert into public.pet_media(
  pet_id,created_by,media_type,storage_bucket,storage_path,sort_order,is_primary,
  visibility,provenance_code,status,created_at,updated_at
)
select
  p.id,p.created_by,'image','pet-photos',coalesce(nullif(p.primary_photo_path,''),nullif(p.photo_path,'')),
  0,true,'private','system_generated','active',p.created_at,p.updated_at
from public.pets p
where coalesce(nullif(p.primary_photo_path,''),nullif(p.photo_path,'')) is not null
  and not exists (
    select 1 from public.pet_media m where m.pet_id=p.id and m.status='active'
  );

create or replace function public.set_primary_pet_media(p_media_id uuid)
returns uuid
language plpgsql
security definer
set search_path=''
as $$
declare
  v_media public.pet_media;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode='42501';
  end if;

  select * into v_media
  from public.pet_media
  where id=p_media_id and status='active'
  for update;

  if v_media.id is null or v_media.media_type <> 'image' then
    raise exception 'Active image not found' using errcode='22023';
  end if;

  if not exists (
    select 1 from public.guardianships g
    where g.pet_id=v_media.pet_id
      and g.guardian_id=auth.uid()
      and g.relationship='primary'
      and g.status='active'
      and g.ended_at is null
  ) then
    raise exception 'Primary Guardian authority required' using errcode='42501';
  end if;

  update public.pet_media
  set is_primary=false
  where pet_id=v_media.pet_id and status='active' and is_primary and id<>v_media.id;

  update public.pet_media
  set is_primary=true
  where id=v_media.id;

  -- Maintain the legacy pointer while the application transitions to pet_media.
  if v_media.storage_path is not null then
    update public.pets
    set primary_photo_path=v_media.storage_path
    where id=v_media.pet_id;
  end if;

  return v_media.id;
end
$$;

revoke all on function public.set_primary_pet_media(uuid) from public,anon;
grant execute on function public.set_primary_pet_media(uuid) to authenticated;

create or replace function public.reorder_pet_media(p_pet_id uuid,p_media_ids uuid[])
returns void
language plpgsql
security definer
set search_path=''
as $$
declare
  v_active_count integer;
  v_supplied_count integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode='42501';
  end if;

  if not exists (
    select 1 from public.guardianships g
    where g.pet_id=p_pet_id
      and g.guardian_id=auth.uid()
      and g.relationship='primary'
      and g.status='active'
      and g.ended_at is null
  ) then
    raise exception 'Primary Guardian authority required' using errcode='42501';
  end if;

  select count(*) into v_active_count
  from public.pet_media
  where pet_id=p_pet_id and status='active';

  select count(distinct x) into v_supplied_count
  from unnest(coalesce(p_media_ids,array[]::uuid[])) x;

  if v_active_count <> cardinality(coalesce(p_media_ids,array[]::uuid[]))
     or v_active_count <> v_supplied_count
     or v_active_count <> (
       select count(*) from public.pet_media m
       where m.pet_id=p_pet_id and m.status='active' and m.id=any(p_media_ids)
     ) then
    raise exception 'Media order must contain every active pet media item exactly once' using errcode='22023';
  end if;

  update public.pet_media m
  set sort_order=(ordered.ordinality-1)::integer * 10
  from unnest(p_media_ids) with ordinality as ordered(id,ordinality)
  where m.id=ordered.id and m.pet_id=p_pet_id and m.status='active';
end
$$;

revoke all on function public.reorder_pet_media(uuid,uuid[]) from public,anon;
grant execute on function public.reorder_pet_media(uuid,uuid[]) to authenticated;

-- Co-guardians with an active guardianship may read the private object bytes for
-- media already authorized by pet_media RLS. Upload remains restricted to the
-- existing user-owned folder policy; the application stores new objects as
-- <guardian-id>/<pet-id>/<random-file>.
drop policy if exists active_guardian_pet_photo_read on storage.objects;
create policy active_guardian_pet_photo_read
on storage.objects for select to authenticated
using (
  bucket_id='pet-photos'
  and array_length(storage.foldername(name),1) >= 2
  and exists (
    select 1 from public.guardianships g
    where g.pet_id::text=(storage.foldername(name))[2]
      and g.guardian_id=(select auth.uid())
      and g.status='active'
      and g.ended_at is null
  )
);

-- The Guardian timeline is derived from canonical claim/redemption records.
-- It intentionally exposes no savings amount while OD-003 remains unresolved.
create or replace function public.guardian_activity_feed(p_limit integer default 25)
returns table(
  feed_id text,
  item_type text,
  claim_id uuid,
  offer_id uuid,
  pet_id uuid,
  pet_name text,
  business_name text,
  offer_title text,
  activity_status text,
  claimed_at timestamptz,
  redeemed_at timestamptz,
  activity_at timestamptz
)
language sql
stable
security definer
set search_path=''
as $$
  select
    'claim:'||c.id::text as feed_id,
    'offer_claim'::text as item_type,
    c.id as claim_id,
    c.offer_id,
    c.pet_id,
    p.name as pet_name,
    org.public_name as business_name,
    v.title as offer_title,
    case
      when r.status='confirmed' then 'redeemed'
      when r.status='reversed' then 'reversed'
      when r.status='disputed' then 'disputed'
      when c.status='cancelled' then 'cancelled'
      when c.expires_at is not null and c.expires_at<=now() and c.status<>'utilized' then 'expired'
      else 'pending'
    end as activity_status,
    c.claimed_at,
    case when r.status in ('confirmed','reversed','disputed') then r.confirmed_at else null end as redeemed_at,
    coalesce(re.last_event_at,r.confirmed_at,c.claimed_at) as activity_at
  from public.offer_claims c
  join public.offers o on o.id=c.offer_id
  join public.offer_versions v on v.id=c.offer_version_id
  left join public.organizations org on org.id=o.organization_id
  left join public.pets p on p.id=c.pet_id
  left join lateral (
    select rr.*
    from public.redemptions rr
    where rr.claim_id=c.id
    order by rr.created_at desc,rr.id desc
    limit 1
  ) r on true
  left join lateral (
    select max(e.created_at) as last_event_at
    from public.redemption_events e
    where e.redemption_id=r.id
  ) re on true
  where auth.uid() is not null
    and c.guardian_id=auth.uid()
  order by coalesce(re.last_event_at,r.confirmed_at,c.claimed_at) desc,c.id desc
  limit least(greatest(coalesce(p_limit,25),1),100)
$$;

revoke all on function public.guardian_activity_feed(integer) from public,anon;
grant execute on function public.guardian_activity_feed(integer) to authenticated;
