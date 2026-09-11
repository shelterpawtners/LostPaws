begin;
create extension if not exists pgtap with schema extensions;
select plan(8);

select ok(
  exists(select 1 from storage.buckets where id='profile-avatars' and public=false),
  'Guardian avatar bucket is private'
);

select is(
  (select file_size_limit from storage.buckets where id='profile-avatars'),
  5242880::bigint,
  'Guardian avatar bucket limits files to 5 MB'
);

select ok(
  (select allowed_mime_types @> array['image/jpeg','image/png','image/webp'] from storage.buckets where id='profile-avatars'),
  'Guardian avatar bucket allows the approved image types'
);

select ok(
  exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='own_profile_avatar_read' and roles @> array['authenticated']::name[]),
  'Authenticated Guardian has an owner-scoped avatar read policy'
);

select ok(
  exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='own_profile_avatar_add' and roles @> array['authenticated']::name[]),
  'Authenticated Guardian has an owner-scoped avatar insert policy'
);

select ok(
  exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='own_profile_avatar_update' and roles @> array['authenticated']::name[]),
  'Authenticated Guardian has an owner-scoped avatar update policy'
);

select ok(
  exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='own_profile_avatar_delete' and roles @> array['authenticated']::name[]),
  'Authenticated Guardian has an owner-scoped avatar delete policy'
);

select ok(
  exists(
    select 1
    from information_schema.columns
    where table_schema='public'
      and table_name='profiles'
      and column_name='avatar_path'
  ),
  'Guardian avatar reuses the canonical profiles.avatar_path field'
);

select * from finish();
rollback;
