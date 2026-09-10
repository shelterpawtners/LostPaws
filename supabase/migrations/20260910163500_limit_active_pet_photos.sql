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
