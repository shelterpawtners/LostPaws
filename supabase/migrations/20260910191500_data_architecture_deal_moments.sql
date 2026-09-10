-- Data Architecture Slice 2: Guardian Deal Moments.
-- Deal Moment media is private claim-owned activity content and does not count
-- against the five active Passport-photo slots.

alter table public.pet_media
  add column if not exists media_context text not null default 'passport',
  add column if not exists claim_id uuid references public.offer_claims(id);

alter table public.pet_media
  drop constraint if exists pet_media_media_context_check,
  add constraint pet_media_media_context_check
    check (media_context in ('passport','deal_moment')),
  drop constraint if exists pet_media_deal_moment_shape_check,
  add constraint pet_media_deal_moment_shape_check
    check (
      (media_context='passport' and claim_id is null)
      or
      (
        media_context='deal_moment'
        and claim_id is not null
        and media_type='image'
        and visibility='private'
        and not is_primary
        and (caption is null or char_length(caption) <= 280)
      )
    );

create unique index if not exists pet_media_one_active_deal_moment_per_claim
  on public.pet_media(claim_id)
  where media_context='deal_moment' and status='active';

create index if not exists pet_media_claim_context_idx
  on public.pet_media(claim_id,status,created_at desc)
  where claim_id is not null;

-- Protect immutable linkage and validate Deal Moment claim/pet ownership without
-- leaking another Guardian's claim details before RLS can reject their write.
create or replace function private.validate_pet_media_context()
returns trigger
language plpgsql
security definer
set search_path=''
as $$
declare
  v_claim public.offer_claims;
begin
  if tg_op='UPDATE' and (
    new.media_context is distinct from old.media_context
    or new.claim_id is distinct from old.claim_id
    or new.pet_id is distinct from old.pet_id
    or new.created_by is distinct from old.created_by
  ) then
    raise exception 'Pet media identity and context cannot be changed' using errcode='22023';
  end if;

  if new.media_context <> 'deal_moment' then
    return new;
  end if;

  if auth.uid() is not null and not exists (
    select 1
    from public.offer_claims c
    where c.id=new.claim_id and c.guardian_id=auth.uid()
  ) then
    -- Let RLS provide the authorization denial without revealing claim state.
    return new;
  end if;

  select * into v_claim
  from public.offer_claims c
  where c.id=new.claim_id;

  if v_claim.id is null then
    raise exception 'Claim not found' using errcode='22023';
  end if;
  if v_claim.pet_id is null then
    raise exception 'A Deal Moment requires a claim linked to a pet' using errcode='22023';
  end if;
  if new.pet_id <> v_claim.pet_id then
    raise exception 'Deal Moment pet must match the claimed pet' using errcode='22023';
  end if;
  if new.created_by <> v_claim.guardian_id then
    raise exception 'Deal Moment creator must own the claim' using errcode='42501';
  end if;

  return new;
end
$$;

revoke all on function private.validate_pet_media_context() from public,anon,authenticated;

drop trigger if exists validate_pet_media_context on public.pet_media;
create trigger validate_pet_media_context
before insert or update on public.pet_media
for each row execute function private.validate_pet_media_context();

-- Passport photo storage limit applies only to Passport media, never activity media.
create or replace function private.enforce_active_pet_photo_limit()
returns trigger
language plpgsql
security definer
set search_path=''
as $$
declare
  v_active_images integer;
begin
  if new.media_context <> 'passport' or new.media_type <> 'image' or new.status <> 'active' then
    return new;
  end if;

  if auth.uid() is not null and not exists (
    select 1
    from public.guardianships g
    where g.pet_id=new.pet_id
      and g.guardian_id=auth.uid()
      and g.relationship='primary'
      and g.status='active'
      and g.ended_at is null
  ) then
    return new;
  end if;

  perform 1
  from public.pets p
  where p.id=new.pet_id
  for update;

  select count(*) into v_active_images
  from public.pet_media m
  where m.pet_id=new.pet_id
    and m.media_context='passport'
    and m.media_type='image'
    and m.status='active'
    and m.id<>new.id;

  if v_active_images >= 5 then
    raise exception 'A Pet Passport can have up to 5 active photos.' using errcode='23514';
  end if;

  return new;
end
$$;

revoke all on function private.enforce_active_pet_photo_limit() from public,anon,authenticated;

drop trigger if exists enforce_active_pet_photo_limit on public.pet_media;
create trigger enforce_active_pet_photo_limit
before insert or update of pet_id,media_type,media_context,status on public.pet_media
for each row execute function private.enforce_active_pet_photo_limit();

-- Context-aware RLS: Passport media follows active guardianship; Deal Moments are
-- private to the Guardian who owns the linked claim.
drop policy if exists pet_media_active_guardian_read on public.pet_media;
create policy pet_media_context_read
on public.pet_media for select to authenticated
using (
  (
    media_context='passport'
    and exists (
      select 1
      from public.guardianships g
      where g.pet_id=pet_media.pet_id
        and g.guardian_id=(select auth.uid())
        and g.status='active'
        and g.ended_at is null
    )
  )
  or
  (
    media_context='deal_moment'
    and created_by=(select auth.uid())
    and exists (
      select 1
      from public.offer_claims c
      where c.id=pet_media.claim_id
        and c.guardian_id=(select auth.uid())
    )
  )
);

drop policy if exists pet_media_primary_guardian_insert on public.pet_media;
create policy pet_media_context_insert
on public.pet_media for insert to authenticated
with check (
  (
    media_context='passport'
    and created_by=(select auth.uid())
    and exists (
      select 1
      from public.guardianships g
      where g.pet_id=pet_media.pet_id
        and g.guardian_id=(select auth.uid())
        and g.relationship='primary'
        and g.status='active'
        and g.ended_at is null
    )
  )
  or
  (
    media_context='deal_moment'
    and created_by=(select auth.uid())
    and exists (
      select 1
      from public.offer_claims c
      where c.id=pet_media.claim_id
        and c.guardian_id=(select auth.uid())
        and c.pet_id=pet_media.pet_id
        and c.pet_id is not null
    )
  )
);

drop policy if exists pet_media_primary_guardian_update on public.pet_media;
create policy pet_media_context_update
on public.pet_media for update to authenticated
using (
  (
    media_context='passport'
    and exists (
      select 1
      from public.guardianships g
      where g.pet_id=pet_media.pet_id
        and g.guardian_id=(select auth.uid())
        and g.relationship='primary'
        and g.status='active'
        and g.ended_at is null
    )
  )
  or
  (
    media_context='deal_moment'
    and created_by=(select auth.uid())
    and exists (
      select 1
      from public.offer_claims c
      where c.id=pet_media.claim_id
        and c.guardian_id=(select auth.uid())
    )
  )
)
with check (
  (
    media_context='passport'
    and exists (
      select 1
      from public.guardianships g
      where g.pet_id=pet_media.pet_id
        and g.guardian_id=(select auth.uid())
        and g.relationship='primary'
        and g.status='active'
        and g.ended_at is null
    )
  )
  or
  (
    media_context='deal_moment'
    and created_by=(select auth.uid())
    and exists (
      select 1
      from public.offer_claims c
      where c.id=pet_media.claim_id
        and c.guardian_id=(select auth.uid())
        and c.pet_id=pet_media.pet_id
    )
  )
);

-- Passport-only primary/reorder behavior prevents Deal Moments from entering the
-- profile gallery or changing the canonical primary Passport image.
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
  where id=p_media_id
    and media_context='passport'
    and media_type='image'
    and status='active'
  for update;

  if v_media.id is null then
    raise exception 'Active Passport image not found' using errcode='22023';
  end if;

  if not exists (
    select 1
    from public.guardianships g
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
  where pet_id=v_media.pet_id
    and media_context='passport'
    and status='active'
    and is_primary
    and id<>v_media.id;

  update public.pet_media set is_primary=true where id=v_media.id;

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
    select 1
    from public.guardianships g
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
  where pet_id=p_pet_id and media_context='passport' and status='active';

  select count(distinct x) into v_supplied_count
  from unnest(coalesce(p_media_ids,array[]::uuid[])) x;

  if v_active_count <> cardinality(coalesce(p_media_ids,array[]::uuid[]))
     or v_active_count <> v_supplied_count
     or v_active_count <> (
       select count(*) from public.pet_media m
       where m.pet_id=p_pet_id
         and m.media_context='passport'
         and m.status='active'
         and m.id=any(p_media_ids)
     ) then
    raise exception 'Media order must contain every active Passport media item exactly once' using errcode='22023';
  end if;

  update public.pet_media m
  set sort_order=(ordered.ordinality-1)::integer * 10
  from unnest(p_media_ids) with ordinality as ordered(id,ordinality)
  where m.id=ordered.id
    and m.pet_id=p_pet_id
    and m.media_context='passport'
    and m.status='active';
end
$$;

revoke all on function public.reorder_pet_media(uuid,uuid[]) from public,anon;
grant execute on function public.reorder_pet_media(uuid,uuid[]) to authenticated;

-- Atomic metadata replacement. The browser uploads the new private WebP object
-- first, calls this RPC, then deletes any returned old object. A failed RPC rolls
-- back the metadata replacement and the browser removes the newly uploaded object.
create or replace function public.upsert_deal_moment(
  p_claim_id uuid,
  p_storage_path text,
  p_caption text default null,
  p_alt_text text default null
)
returns table(media_id uuid,old_storage_bucket text,old_storage_path text)
language plpgsql
security definer
set search_path=''
as $$
declare
  v_claim public.offer_claims;
  v_existing public.pet_media;
  v_new_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode='42501';
  end if;

  select * into v_claim
  from public.offer_claims c
  where c.id=p_claim_id and c.guardian_id=auth.uid()
  for update;

  if v_claim.id is null then
    raise exception 'Claim not found' using errcode='22023';
  end if;
  if v_claim.pet_id is null then
    raise exception 'A Deal Moment requires a claim linked to a pet' using errcode='22023';
  end if;
  if p_storage_path is null
     or p_storage_path !~ ('^'||auth.uid()::text||'/'||p_claim_id::text||'/[0-9A-Fa-f-]+[.]webp$') then
    raise exception 'Invalid Deal Moment storage path' using errcode='22023';
  end if;
  if p_caption is not null and char_length(p_caption) > 280 then
    raise exception 'Deal Moment captions can be up to 280 characters' using errcode='22023';
  end if;

  select * into v_existing
  from public.pet_media m
  where m.claim_id=p_claim_id
    and m.media_context='deal_moment'
    and m.status='active'
  for update;

  if v_existing.id is not null then
    update public.pet_media
    set status='archived'
    where id=v_existing.id;
  end if;

  insert into public.pet_media(
    pet_id,created_by,media_type,storage_bucket,storage_path,claim_id,media_context,
    caption,alt_text,sort_order,is_primary,visibility,provenance_code,status
  ) values (
    v_claim.pet_id,auth.uid(),'image','deal-moments',p_storage_path,p_claim_id,'deal_moment',
    nullif(btrim(p_caption),''),nullif(btrim(p_alt_text),''),0,false,'private','guardian_entered','active'
  ) returning id into v_new_id;

  return query select v_new_id,v_existing.storage_bucket,v_existing.storage_path;
end
$$;

revoke all on function public.upsert_deal_moment(uuid,text,text,text) from public,anon;
grant execute on function public.upsert_deal_moment(uuid,text,text,text) to authenticated;

-- Archive is context-aware: Passport media requires primary-Guardian authority;
-- Deal Moments require ownership of the linked claim.
create or replace function public.archive_pet_media(p_media_id uuid)
returns table(storage_bucket text,storage_path text)
language plpgsql
security definer
set search_path=''
as $$
declare
  v_media public.pet_media;
  v_next public.pet_media;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode='42501';
  end if;

  select * into v_media
  from public.pet_media
  where id=p_media_id and status='active'
  for update;

  if v_media.id is null then
    raise exception 'Active media not found' using errcode='22023';
  end if;

  if v_media.media_context='deal_moment' then
    if v_media.created_by<>auth.uid() or not exists (
      select 1 from public.offer_claims c
      where c.id=v_media.claim_id and c.guardian_id=auth.uid()
    ) then
      raise exception 'Deal Moment owner authority required' using errcode='42501';
    end if;
  elsif not exists (
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
  set status='archived',is_primary=false
  where id=v_media.id;

  if v_media.media_context='passport' and v_media.is_primary then
    select * into v_next
    from public.pet_media
    where pet_id=v_media.pet_id
      and media_context='passport'
      and media_type='image'
      and status='active'
    order by sort_order,created_at,id
    limit 1
    for update;

    if v_next.id is not null then
      update public.pet_media set is_primary=true where id=v_next.id;
      update public.pets
      set primary_photo_path=case
        when v_next.storage_bucket='pet-photos' then v_next.storage_path
        else null
      end
      where id=v_media.pet_id;
    else
      update public.pets set primary_photo_path=null where id=v_media.pet_id;
    end if;
  end if;

  return query select v_media.storage_bucket,v_media.storage_path;
end
$$;

revoke all on function public.archive_pet_media(uuid) from public,anon;
grant execute on function public.archive_pet_media(uuid) to authenticated;

-- Separate private bucket avoids inheriting co-Guardian Passport-photo reads.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('deal-moments','deal-moments',false,1048576,array['image/webp'])
on conflict(id) do update
set public=false,file_size_limit=1048576,allowed_mime_types=array['image/webp'];

drop policy if exists deal_moment_owner_read on storage.objects;
create policy deal_moment_owner_read
on storage.objects for select to authenticated
using (
  bucket_id='deal-moments'
  and array_length(storage.foldername(name),1) >= 2
  and (storage.foldername(name))[1]=((select auth.uid())::text)
  and exists (
    select 1 from public.offer_claims c
    where c.id::text=(storage.foldername(name))[2]
      and c.guardian_id=(select auth.uid())
  )
);

drop policy if exists deal_moment_owner_add on storage.objects;
create policy deal_moment_owner_add
on storage.objects for insert to authenticated
with check (
  bucket_id='deal-moments'
  and array_length(storage.foldername(name),1) >= 2
  and (storage.foldername(name))[1]=((select auth.uid())::text)
  and exists (
    select 1 from public.offer_claims c
    where c.id::text=(storage.foldername(name))[2]
      and c.guardian_id=(select auth.uid())
      and c.pet_id is not null
  )
);

drop policy if exists deal_moment_owner_delete on storage.objects;
create policy deal_moment_owner_delete
on storage.objects for delete to authenticated
using (
  bucket_id='deal-moments'
  and array_length(storage.foldername(name),1) >= 2
  and (storage.foldername(name))[1]=((select auth.uid())::text)
  and exists (
    select 1 from public.offer_claims c
    where c.id::text=(storage.foldername(name))[2]
      and c.guardian_id=(select auth.uid())
  )
);
