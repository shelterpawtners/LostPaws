begin;
create extension if not exists pgtap with schema extensions;
select plan(8);

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000005',true);
insert into public.store_products(id,slug,name,short_description,price_minor,category,brand,status)
values ('50000000-0000-0000-0000-000000000002','qa-request-product','QA Request Product','A QA product for request RLS.',900,'stickers','LostPaws','active');
select is((select count(*)::bigint from public.store_products where id='50000000-0000-0000-0000-000000000002'),1::bigint,'test product exists');

set local role anon;
select lives_ok(
  $$select public.create_store_request('50000000-0000-0000-0000-000000000002','Request QA','request@example.invalid',null,null,1,null)$$,
  'anon can submit a new product request'
);
select throws_ok(
  $$select public.create_store_request('60000000-0000-0000-0000-000000000005','Request QA','request@example.invalid',null,null,1,null)$$,
  'P0001',
  'This item is not available for requests.',
  'anon cannot request a coming-soon catalog product'
);
select is((select count(*)::bigint from public.store_requests),0::bigint,'anon cannot read requests');

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
select throws_ok(
  $$insert into public.store_requests(product_id,product_slug_snapshot,unit_price_minor,currency,requester_name,requester_email,status)
    values ('50000000-0000-0000-0000-000000000002','forged',1,'USD','Request QA','request@example.invalid','fulfilled')$$,
  '42501',null,'public request creation cannot set a non-new status'
);

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000005',true);
select is((select count(*)::bigint from public.store_requests),1::bigint,'platform admin can read requests');
select lives_ok(
  $$update public.store_requests set status='contacted'$$,
  'platform admin can update request status'
);
select is(
  (select count(*)::bigint from public.store_products where id between '60000000-0000-0000-0000-000000000001' and '60000000-0000-0000-0000-000000000008'),
  8::bigint,
  'all committed catalog products have stable database backing'
);
select * from finish();
rollback;
