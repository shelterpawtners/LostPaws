begin;
create extension if not exists pgtap with schema extensions;
select plan(9);

-- Fixed ids rather than a temp table, same reasoning as
-- track2_events_foundation.sql: this test switches roles, and a temp table
-- created under one role is not readable by another.
-- 50000000-...0001 = draft product, 50000000-...0002 = active product.

-- A non-admin authenticated user cannot create a Store product.
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
select throws_ok(
  $$insert into public.store_products(id,slug,name,short_description,price_minor,category,brand) values ('50000000-0000-0000-0000-000000000001','qa-draft-product','QA Draft Product','A QA-only draft product.',500,'stickers','ShelterPawtners')$$,
  '42501',null,'a non-admin authenticated user cannot create a Store product'
);

-- The seeded platform_admin can create both a draft and an active product.
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000005',true);
insert into public.store_products(id,slug,name,short_description,price_minor,category,brand,status)
values ('50000000-0000-0000-0000-000000000001','qa-draft-product','QA Draft Product','A QA-only draft product.',500,'stickers','ShelterPawtners','draft');
insert into public.store_products(id,slug,name,short_description,price_minor,category,brand,status)
values ('50000000-0000-0000-0000-000000000002','qa-active-product','QA Active Product','A QA-only active product.',900,'apparel','LostPaws','active');
select is((select count(*) from public.store_products where id in ('50000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000002'))::bigint,2::bigint,'platform_admin can create both a draft and an active product');
select throws_ok(
  $$insert into public.store_products(slug,name,short_description,price_minor,category,brand) values ('qa-bad-category','QA Bad Category','x',100,'not_a_real_category','LostPaws')$$,
  '23514',null,'an invalid category is rejected by the check constraint'
);
select lives_ok($$update public.store_products set price_minor=550 where id='50000000-0000-0000-0000-000000000001'$$,'platform_admin can edit any product, including a draft');

-- A non-admin authenticated user can see the active product but not the draft.
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
select is((select count(*) from public.store_products where id='50000000-0000-0000-0000-000000000002')::bigint,1::bigint,'a non-admin authenticated user can see the active product');
select is((select count(*) from public.store_products where id='50000000-0000-0000-0000-000000000001')::bigint,0::bigint,'a non-admin authenticated user cannot see the draft product');
update public.store_products set price_minor=1 where id='50000000-0000-0000-0000-000000000002';
select isnt((select price_minor from public.store_products where id='50000000-0000-0000-0000-000000000002'),1,'a non-admin authenticated user cannot edit the active product');

-- anon can see the active product but not the draft.
select set_config('request.jwt.claim.sub','',true);
set local role anon;
select is((select count(*) from public.store_products where id='50000000-0000-0000-0000-000000000002')::bigint,1::bigint,'anon can see the active product');
select is((select count(*) from public.store_products where id='50000000-0000-0000-0000-000000000001')::bigint,0::bigint,'anon cannot see the draft product');

select * from finish();
rollback;
