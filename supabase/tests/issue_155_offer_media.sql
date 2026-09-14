begin;
create extension if not exists pgtap with schema extensions;
select plan(12);

-- Org A (20000000-...0001, owned by user 10000000-...0003) is a seeded demo
-- org; public_active_offers excludes is_demo orgs, so flip that flag for
-- this rolled-back transaction only, same as issue_154's own test.
update public.organizations set is_demo=false where id='20000000-0000-0000-0000-000000000001';

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);

-- Backward compatibility: a caller that only sets source_url (the old,
-- pre-#155 shape) still gets destination_url mirrored from it.
select public.create_partner_offer(
  '20000000-0000-0000-0000-000000000001',
  jsonb_build_object(
    'title','Issue 155 QA Legacy Offer','summary','No destination_url key at all.',
    'terms','Terms.','redemption_instructions','Show at checkout.',
    'category','General','channel','pet','source_url','https://example.com/legacy-terms'
  )
);
select is(
  (select destination_url from public.offers where title='Issue 155 QA Legacy Offer'),
  'https://example.com/legacy-terms',
  'omitting destination_url falls back to mirroring source_url, preserving pre-#155 behavior'
);

-- A non-https destination_url is rejected.
select throws_ok(
  $$select public.create_partner_offer('20000000-0000-0000-0000-000000000001', jsonb_build_object('title','Bad URL Offer','summary','x','terms','x','redemption_instructions','x','category','General','channel','pet','destination_url','http://insecure.example.com'))$$,
  'P0001', 'Product/store link must be a valid https:// URL',
  'a non-https destination_url is rejected'
);

-- A non-https image url is rejected.
select throws_ok(
  $$select public.create_partner_offer('20000000-0000-0000-0000-000000000001', jsonb_build_object('title','Bad Image Offer','summary','x','terms','x','redemption_instructions','x','category','General','channel','pet','image_urls',jsonb_build_array('https://example.com/a.jpg','javascript:alert(1)')))$$,
  'P0001', 'Product images must be https:// URLs',
  'a non-https image url is rejected, including a script-scheme injection attempt'
);

-- A fully-populated Etsy-style offer.
select public.create_partner_offer(
  '20000000-0000-0000-0000-000000000001',
  jsonb_build_object(
    'title','Issue 155 QA Etsy Offer','summary','Handmade enamel pin.',
    'terms','See Etsy listing for full terms.','redemption_instructions','Buy directly on Etsy.',
    'category','General','channel','pet',
    'destination_url','https://www.etsy.com/listing/123456789/demo-item',
    'product_label','Hand-painted Shelter Pup Pin',
    'cta_label','Shop on Etsy',
    'image_urls',jsonb_build_array('https://images.example.com/pin-1.jpg','https://images.example.com/pin-2.jpg')
  )
);
select is(
  (select destination_url from public.offers where title='Issue 155 QA Etsy Offer'),
  'https://www.etsy.com/listing/123456789/demo-item',
  'the Etsy product link is stored as its own field'
);
select is(
  (select product_label from public.offers where title='Issue 155 QA Etsy Offer'),
  'Hand-painted Shelter Pup Pin',
  'the product label override is stored'
);
select is(
  (select cta_label from public.offers where title='Issue 155 QA Etsy Offer'),
  'Shop on Etsy',
  'the CTA label override is stored'
);
select is(
  (select array_length(image_urls,1) from public.offers where title='Issue 155 QA Etsy Offer'),
  2,
  'both product images are stored'
);

-- Publish it and confirm public_active_offers surfaces every new field.
select public.set_partner_offer_state(
  (select id from public.offers where title='Issue 155 QA Etsy Offer'),
  'publish'
);

reset role;
set local role anon;
select is(
  (select destination_url from public.public_active_offers(null,null,null) where title='Issue 155 QA Etsy Offer'),
  'https://www.etsy.com/listing/123456789/demo-item',
  'anon sees the product link through public_active_offers'
);
select is(
  (select cta_label from public.public_active_offers(null,null,null) where title='Issue 155 QA Etsy Offer'),
  'Shop on Etsy',
  'anon sees the CTA label through public_active_offers'
);
select is(
  (select array_length(image_urls,1) from public.public_active_offers(null,null,null) where title='Issue 155 QA Etsy Offer'),
  2,
  'anon sees both product images through public_active_offers'
);

-- A superuser bypassing the RPC still cannot store a non-https image url:
-- the check constraint on the new column holds regardless of write path.
reset role;
select throws_ok(
  $$insert into public.offers(organization_id,created_by,channel,title,summary,category,status,image_urls) values ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','pet','Direct Insert Bad Image','x','General','draft',array['http://insecure.example.com/a.jpg'])$$,
  '23514',null,
  'the database-level check constraint rejects a non-https image url even bypassing the RPC'
);

-- Revising an offer updates the new fields.
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
select public.revise_partner_offer(
  (select id from public.offers where title='Issue 155 QA Etsy Offer'),
  jsonb_build_object(
    'title','Issue 155 QA Etsy Offer','summary','Handmade enamel pin.',
    'terms','See Etsy listing for full terms.','redemption_instructions','Buy directly on Etsy.',
    'category','General','destination_url','https://www.etsy.com/listing/999999999/updated-item',
    'product_label','Updated Pin Name'
  )
);
select is(
  (select destination_url from public.offers where title='Issue 155 QA Etsy Offer'),
  'https://www.etsy.com/listing/999999999/updated-item',
  'revising an offer updates its product link'
);

select * from finish();
rollback;
