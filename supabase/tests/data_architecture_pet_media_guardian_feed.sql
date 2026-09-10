begin;
create extension if not exists pgtap with schema extensions;
select plan(13);

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);

create temp table media_test(first_id uuid,second_id uuid);
with first_media as (
  insert into public.pet_media(
    pet_id,created_by,storage_bucket,storage_path,caption,sort_order,provenance_code
  ) values (
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'pet-photos','10000000-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000001/first.jpg',
    'First pet photo',0,'guardian_entered'
  ) returning id
)
insert into media_test(first_id) select id from first_media;

with second_media as (
  insert into public.pet_media(
    pet_id,created_by,storage_bucket,storage_path,caption,sort_order,provenance_code
  ) values (
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'pet-photos','10000000-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000001/second.jpg',
    'Second pet photo',10,'guardian_entered'
  ) returning id
)
update media_test set second_id=(select id from second_media);

select is(
  (select count(*) from public.pet_media where pet_id='30000000-0000-0000-0000-000000000001')::bigint,
  2::bigint,
  'Primary Guardian can keep multiple photos for one pet'
);
select lives_ok(
  format('select public.set_primary_pet_media(%L::uuid)',(select second_id from media_test)),
  'Primary Guardian can select a primary image'
);
select is(
  (select id from public.pet_media where pet_id='30000000-0000-0000-0000-000000000001' and is_primary),
  (select second_id from media_test),
  'Exactly the selected image is primary'
);
select lives_ok(
  format(
    'select public.reorder_pet_media(%L::uuid,array[%L::uuid,%L::uuid])',
    '30000000-0000-0000-0000-000000000001',
    (select second_id from media_test),
    (select first_id from media_test)
  ),
  'Primary Guardian can reorder all active pet media atomically'
);
select is(
  (select sort_order from public.pet_media where id=(select second_id from media_test)),
  0,
  'Requested media order is persisted'
);

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000002',true);
select is(
  (select count(*) from public.pet_media where pet_id='30000000-0000-0000-0000-000000000001')::bigint,
  0::bigint,
  'Unrelated Guardian cannot read another pet media gallery'
);
select throws_ok(
  $$insert into public.pet_media(pet_id,created_by,storage_bucket,storage_path) values('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000002','pet-photos','10000000-0000-0000-0000-000000000002/30000000-0000-0000-0000-000000000001/attack.jpg')$$,
  '42501',null,
  'Unrelated Guardian cannot add media to another pet'
);
select throws_ok(
  format('select public.set_primary_pet_media(%L::uuid)',(select second_id from media_test)),
  '42501',null,
  'Unrelated Guardian cannot change another pet primary image'
);

create temp table feed_test(offer_id uuid,claim_id uuid,code text,redemption_id uuid);
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
insert into feed_test(offer_id)
select public.create_partner_offer(
  '20000000-0000-0000-0000-000000000001',
  '{"title":"Timeline grooming offer","summary":"Timeline QA offer","details":"For local testing only.","terms":"Demo test terms.","category":"Grooming","eligibility_kind":"all_pets","claim_window_days":"30","per_user_limit":"1","redemption_instructions":"Show the private code.","disclosure":"Demo only.","applicability":"online"}'::jsonb
);
select public.set_partner_offer_state((select offer_id from feed_test),'publish');

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
with c as (
  select * from public.claim_offer(
    (select offer_id from feed_test),
    '30000000-0000-0000-0000-000000000001'
  )
)
update feed_test f set claim_id=c.claim_id,code=c.redeem_code from c;

select is(
  (select activity_status from public.guardian_activity_feed(25) where claim_id=(select claim_id from feed_test)),
  'pending',
  'Guardian timeline derives pending status from an unredeemed claim'
);
select is(
  (select offer_title from public.guardian_activity_feed(25) where claim_id=(select claim_id from feed_test)),
  'Timeline grooming offer',
  'Guardian timeline uses the claimed immutable offer-version title'
);

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000002',true);
select is(
  (select count(*) from public.guardian_activity_feed(25) where claim_id=(select claim_id from feed_test))::bigint,
  0::bigint,
  'Guardian timeline cannot reveal another Guardian claim'
);

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
update feed_test set redemption_id=public.confirm_redemption(code,null);

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
select is(
  (select activity_status from public.guardian_activity_feed(25) where claim_id=(select claim_id from feed_test)),
  'redeemed',
  'Guardian timeline automatically reflects confirmed redemption state'
);
select ok(
  (select redeemed_at is not null from public.guardian_activity_feed(25) where claim_id=(select claim_id from feed_test)),
  'Redeemed timeline item carries the canonical confirmation timestamp'
);

select * from finish();
rollback;
