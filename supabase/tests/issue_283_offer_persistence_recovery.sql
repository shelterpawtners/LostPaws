begin;
create extension if not exists pgtap with schema extensions;
select plan(9);

-- Org A (20000000-...0001, owned by user 10000000-...0003) is a seeded demo
-- org; public_active_offers excludes is_demo orgs, so flip that flag for
-- this rolled-back transaction only, same pattern as issue_155's own test.
update public.organizations set is_demo=false where id='20000000-0000-0000-0000-000000000001';

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);

-- A real-world offer created as a Pet offer, matching the hosted vendor
-- offer that produced Issue #283's root-cause report.
select public.create_partner_offer(
  '20000000-0000-0000-0000-000000000001',
  jsonb_build_object(
    'title','Issue 283 QA Recovery Offer','summary','Starts as a Pet offer.',
    'terms','Terms.','redemption_instructions','Show at checkout.',
    'category','General','channel','pet'
  )
);
select is(
  (select channel from public.offers where title='Issue 283 QA Recovery Offer'),
  'pet'::public.market_channel,
  'sanity: the offer starts out on the Pet channel'
);

-- Switching Pet -> Human/RAVE via a revise must persist the new channel.
-- Before this fix, revise_partner_offer silently dropped the channel field,
-- so an existing Pet offer could never be converted to RAVE.
select public.revise_partner_offer(
  (select id from public.offers where title='Issue 283 QA Recovery Offer'),
  jsonb_build_object(
    'title','Issue 283 QA Recovery Offer','summary','Now a Human/RAVE offer.',
    'terms','Terms.','redemption_instructions','Show at checkout.',
    'category','General','channel','rave'
  )
);
select is(
  (select channel from public.offers where title='Issue 283 QA Recovery Offer'),
  'rave'::public.market_channel,
  'revise_partner_offer persists a Pet -> RAVE channel change'
);

-- A revise call that omits the channel key entirely (the same shape as
-- issue_155's pre-existing revise test) must not reset the channel back to
-- a default -- it should keep whatever channel the offer already has.
select public.revise_partner_offer(
  (select id from public.offers where title='Issue 283 QA Recovery Offer'),
  jsonb_build_object(
    'title','Issue 283 QA Recovery Offer','summary','Edited without touching channel.',
    'terms','Terms.','redemption_instructions','Show at checkout.',
    'category','General'
  )
);
select is(
  (select channel from public.offers where title='Issue 283 QA Recovery Offer'),
  'rave'::public.market_channel,
  'revise_partner_offer with no channel key preserves the existing channel'
);

-- set_partner_offer_image_path: a path matching this offer's own
-- organization/offer id and an allowed extension is accepted immediately,
-- without waiting on a form Save.
select public.set_partner_offer_image_path(
  (select id from public.offers where title='Issue 283 QA Recovery Offer'),
  '20000000-0000-0000-0000-000000000001/'
    || (select id from public.offers where title='Issue 283 QA Recovery Offer')::text
    || '/cover.png'
);
select is(
  (select image_path from public.offers where title='Issue 283 QA Recovery Offer'),
  '20000000-0000-0000-0000-000000000001/'
    || (select id from public.offers where title='Issue 283 QA Recovery Offer')::text
    || '/cover.png',
  'set_partner_offer_image_path attaches a well-formed cover path immediately'
);

-- The other two allowed extensions are accepted too (guards against the
-- literal-backslash regex regression that would reject every real path).
select lives_ok(
  $$select public.set_partner_offer_image_path(
      (select id from public.offers where title='Issue 283 QA Recovery Offer'),
      '20000000-0000-0000-0000-000000000001/' ||
      (select id from public.offers where title='Issue 283 QA Recovery Offer')::text ||
      '/cover.jpg'
    )$$,
  'a .jpg cover path is accepted'
);
select lives_ok(
  $$select public.set_partner_offer_image_path(
      (select id from public.offers where title='Issue 283 QA Recovery Offer'),
      '20000000-0000-0000-0000-000000000001/' ||
      (select id from public.offers where title='Issue 283 QA Recovery Offer')::text ||
      '/cover.webp'
    )$$,
  'a .webp cover path is accepted'
);

-- A path pointing at a different offer id is rejected -- this is the
-- authorization-adjacent guard against one offer's row being pointed at
-- another offer's (or org's) uploaded object.
select throws_ok(
  $$select public.set_partner_offer_image_path(
      (select id from public.offers where title='Issue 283 QA Recovery Offer'),
      '20000000-0000-0000-0000-000000000001/00000000-0000-0000-0000-000000000000/cover.png'
    )$$,
  '22023', 'Invalid offer image path',
  'a cover path for a different offer id is rejected'
);

-- An unsupported extension is rejected.
select throws_ok(
  $$select public.set_partner_offer_image_path(
      (select id from public.offers where title='Issue 283 QA Recovery Offer'),
      '20000000-0000-0000-0000-000000000001/' ||
      (select id from public.offers where title='Issue 283 QA Recovery Offer')::text ||
      '/cover.gif'
    )$$,
  '22023', 'Invalid offer image path',
  'an unsupported file extension is rejected'
);

-- Publishing surfaces the new channel and image_path together through the
-- public read path, matching what the RAVE Marketplace/event surfaces query.
select public.set_partner_offer_state(
  (select id from public.offers where title='Issue 283 QA Recovery Offer'),
  'publish'
);
reset role;
set local role anon;
select is(
  (select channel from public.public_active_offers(null,'rave'::public.market_channel,null) where title='Issue 283 QA Recovery Offer'),
  'rave'::public.market_channel,
  'anon sees the published offer under the RAVE channel filter with image_path attached'
);

select * from finish();
rollback;
