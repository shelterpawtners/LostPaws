begin;
create extension if not exists pgtap with schema extensions;
select plan(19);

create temp table deal_test(
  pet_id uuid,
  offer_id uuid,
  claim_id uuid,
  first_moment_id uuid,
  second_moment_id uuid,
  returned_old_path text
);
grant select, insert, update on table deal_test to authenticated;

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);

with p as (
  insert into public.pets(created_by,name,species)
  values('10000000-0000-0000-0000-000000000001','Deal Moment QA Pet','dog')
  returning id
)
insert into deal_test(pet_id) select id from p;

insert into public.guardianships(pet_id,guardian_id,relationship,status)
select pet_id,'10000000-0000-0000-0000-000000000001','primary','active'
from deal_test;

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
update deal_test
set offer_id=public.create_partner_offer(
  '20000000-0000-0000-0000-000000000001',
  '{"title":"Deal Moment grooming offer","summary":"Deal Moment QA offer","details":"For local testing only.","terms":"Demo test terms.","category":"Grooming","eligibility_kind":"all_pets","claim_window_days":"30","per_user_limit":"1","redemption_instructions":"Show the private code.","disclosure":"Demo only.","applicability":"online"}'::jsonb
);
select public.set_partner_offer_state((select offer_id from deal_test),'publish');

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
with c as (
  select *
  from public.claim_offer(
    (select offer_id from deal_test),
    (select pet_id from deal_test)
  )
)
update deal_test d set claim_id=c.claim_id from c;

insert into public.pet_media(
  pet_id,created_by,storage_bucket,storage_path,caption,sort_order,provenance_code
)
select
  d.pet_id,
  '10000000-0000-0000-0000-000000000001',
  'pet-photos',
  '10000000-0000-0000-0000-000000000001/'||d.pet_id::text||'/passport-'||g::text||'.jpg',
  'Passport photo '||g::text,
  (g-1)*10,
  'guardian_entered'
from deal_test d
cross join generate_series(1,5) g;

select ok(
  (
    select public=false
      and file_size_limit=1048576
      and allowed_mime_types=array['image/webp']::text[]
    from storage.buckets
    where id='deal-moments'
  ),
  'Deal Moments use a private one-megabyte WebP-only storage bucket'
);
select is(
  (select count(*) from pg_policies where schemaname='storage' and tablename='objects' and policyname in ('deal_moment_owner_read','deal_moment_owner_add','deal_moment_owner_delete'))::bigint,
  3::bigint,
  'Deal Moment storage has separate owner-scoped read/add/delete policies'
);

with r as (
  select *
  from public.upsert_deal_moment(
    (select claim_id from deal_test),
    '10000000-0000-0000-0000-000000000001/'||(select claim_id::text from deal_test)||'/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa.webp',
    'First Deal Moment',
    'QA pet enjoying a grooming offer'
  )
)
update deal_test d set first_moment_id=r.media_id from r;

select ok((select first_moment_id is not null from deal_test),'Claim owner can create a Deal Moment');
select is(
  (select count(*) from public.pet_media where claim_id=(select claim_id from deal_test) and media_context='deal_moment' and status='active')::bigint,
  1::bigint,
  'Exactly one active Deal Moment exists after creation'
);
select is(
  (select media_context from public.pet_media where id=(select first_moment_id from deal_test)),
  'deal_moment',
  'Deal Moment media is explicitly separated from Passport media'
);
select is(
  (select count(*) from public.pet_media where pet_id=(select pet_id from deal_test) and media_context='passport' and media_type='image' and status='active')::bigint,
  5::bigint,
  'Five Passport photos remain active after adding a Deal Moment'
);
select is(
  (select count(*) from public.pet_media where pet_id=(select pet_id from deal_test) and media_type='image' and status='active')::bigint,
  6::bigint,
  'Deal Moment image is additional activity media rather than a Passport slot'
);
select throws_ok(
  format(
    'insert into public.pet_media(pet_id,created_by,storage_bucket,storage_path,caption,sort_order,provenance_code) values(%L::uuid,%L::uuid,%L,%L,%L,50,%L)',
    (select pet_id from deal_test),
    '10000000-0000-0000-0000-000000000001',
    'pet-photos',
    '10000000-0000-0000-0000-000000000001/'||(select pet_id::text from deal_test)||'/sixth.jpg',
    'Sixth Passport photo',
    'guardian_entered'
  ),
  '23514',
  'A Pet Passport can have up to 5 active photos.',
  'Deal Moment does not weaken the five-photo Passport cap'
);

with r as (
  select *
  from public.upsert_deal_moment(
    (select claim_id from deal_test),
    '10000000-0000-0000-0000-000000000001/'||(select claim_id::text from deal_test)||'/bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb.webp',
    'Replacement Deal Moment',
    'Replacement QA photo'
  )
)
update deal_test d
set second_moment_id=r.media_id,returned_old_path=r.old_storage_path
from r;

select isnt(
  (select second_moment_id from deal_test),
  (select first_moment_id from deal_test),
  'Replacing a Deal Moment creates a new media record'
);
select is(
  (select count(*) from public.pet_media where claim_id=(select claim_id from deal_test) and media_context='deal_moment' and status='active')::bigint,
  1::bigint,
  'Replacement preserves the one-active-image-per-claim rule'
);
select is(
  (select count(*) from public.pet_media where claim_id=(select claim_id from deal_test) and media_context='deal_moment' and status='archived')::bigint,
  1::bigint,
  'Replacement archives the previous Deal Moment metadata'
);
select is(
  (select returned_old_path from deal_test),
  '10000000-0000-0000-0000-000000000001/'||(select claim_id::text from deal_test)||'/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa.webp',
  'Replacement returns the old object path for storage cleanup'
);
select is(
  (select caption from public.pet_media where id=(select second_moment_id from deal_test)),
  'Replacement Deal Moment',
  'Replacement caption is stored on the active Deal Moment'
);

reset role;
insert into public.guardianships(pet_id,guardian_id,relationship,status)
select d.pet_id,'10000000-0000-0000-0000-000000000002','co_guardian','active'
from deal_test d;
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000002',true);

select is(
  (select count(*) from public.pet_media where pet_id=(select pet_id from deal_test) and media_context='passport' and status='active')::bigint,
  5::bigint,
  'Active co-Guardian can still read shared Passport photos'
);
select is(
  (select count(*) from public.pet_media where pet_id=(select pet_id from deal_test) and media_context='deal_moment' and status='active')::bigint,
  0::bigint,
  'Co-Guardian cannot read another Guardian claim-owned Deal Moment'
);
select throws_ok(
  format(
    'select * from public.upsert_deal_moment(%L::uuid,%L,%L,%L)',
    (select claim_id from deal_test),
    '10000000-0000-0000-0000-000000000002/'||(select claim_id::text from deal_test)||'/cccccccc-cccc-4ccc-8ccc-cccccccccccc.webp',
    'Unauthorized replacement',
    'Unauthorized photo'
  ),
  '22023',
  'Claim not found',
  'Co-Guardian cannot replace another Guardian claim-owned Deal Moment'
);

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
select lives_ok(
  format('select * from public.archive_pet_media(%L::uuid)',(select second_moment_id from deal_test)),
  'Deal Moment owner can archive the active moment for removal'
);
select is(
  (select count(*) from public.pet_media where claim_id=(select claim_id from deal_test) and media_context='deal_moment' and status='active')::bigint,
  0::bigint,
  'Removing the Deal Moment leaves no active image for the claim'
);
select is(
  (select count(*) from public.pet_media where claim_id=(select claim_id from deal_test) and media_context='deal_moment' and status='archived')::bigint,
  2::bigint,
  'Replacement and removal preserve archived Deal Moment provenance without active storage growth'
);

select * from finish();
rollback;
