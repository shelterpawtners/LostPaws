-- Bound active Pet Passport image storage to five photos per pet.
-- Enforced in the database so UI, imports, and future integrations share one rule.

create or replace function private.enforce_active_pet_photo_limit()
returns trigger
language plpgsql
security definer
set search_path=''
as $$
declare
  v_active_images integer;
begin
  if new.media_type <> 'image' or new.status <> 'active' then
    return new;
  end if;

  -- Serialize media additions/activations for the same pet so concurrent uploads
  -- cannot race past the five-photo limit.
  perform 1
  from public.pets p
  where p.id=new.pet_id
  for update;

  select count(*) into v_active_images
  from public.pet_media m
  where m.pet_id=new.pet_id
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
before insert or update of pet_id,media_type,status on public.pet_media
for each row execute function private.enforce_active_pet_photo_limit();

-- Archive media transactionally and keep the primary-photo pointer valid.
-- The caller may then remove the returned private storage object to free bytes.
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
  set status='archived',is_primary=false
  where id=v_media.id;

  if v_media.is_primary then
    select * into v_next
    from public.pet_media
    where pet_id=v_media.pet_id
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
      update public.pets
      set primary_photo_path=null
      where id=v_media.pet_id;
    end if;
  end if;

  return query select v_media.storage_bucket,v_media.storage_path;
end
$$;

revoke all on function public.archive_pet_media(uuid) from public,anon;
grant execute on function public.archive_pet_media(uuid) to authenticated;

-- Primary Guardians may delete only objects they own inside the pet-photos path.
-- Imported/provider-owned objects remain service-managed until those connectors exist.
drop policy if exists primary_guardian_pet_photo_delete on storage.objects;
create policy primary_guardian_pet_photo_delete
on storage.objects for delete to authenticated
using (
  bucket_id='pet-photos'
  and array_length(storage.foldername(name),1) >= 2
  and (storage.foldername(name))[1]=((select auth.uid())::text)
  and exists (
    select 1 from public.guardianships g
    where g.pet_id::text=(storage.foldername(name))[2]
      and g.guardian_id=(select auth.uid())
      and g.relationship='primary'
      and g.status='active'
      and g.ended_at is null
  )
);
