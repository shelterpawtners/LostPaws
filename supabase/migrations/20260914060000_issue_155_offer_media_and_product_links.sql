-- Issue #155: Etsy-first rich offer media, without scraping Etsy or
-- depending on an unsupported embed.
--
-- Research before implementing (recorded here since there is no code path
-- to point to instead): a plain curl/HTTP request to a live Etsy listing
-- page (no session, no browser fingerprint) returns 403 from Etsy's DataDome
-- bot-protection layer, not the page itself, so scraping or a server-side
-- fetch for oEmbed-style previews is not viable even before touching Etsy's
-- own terms. Etsy has no public oEmbed endpoint. Etsy's Open API v3 can read
-- public listing/shop data with an API key alone (no OAuth needed for reads),
-- but obtaining that key requires an owner-held Etsy developer account and
-- app registration this session has no access to, and using it safely from
-- a browser client would still need a server-side proxy to avoid exposing
-- the shared secret. None of that is a paid-infrastructure blocker, but it
-- is a missing-credential one, so per the issue's own fallback: ship rich
-- vendor-supplied media and a safe external deep link now, and leave
-- official API sync as a documented future follow-up.
--
-- destination_url already exists on public.offers but has one pre-existing
-- quirk worth preserving carefully: create_partner_offer/revise_partner_offer
-- populate it from the same vendor "Source URL" form input as
-- offer_versions.source_url, so historically the two have always matched.
-- This issue wants a genuinely separate "buy this on Etsy/my store" link,
-- distinct from the "review current terms" source link. The RPC changes
-- below add a new, independent p_terms->>'destination_url' input and only
-- fall back to mirroring source_url when that new key is absent, so every
-- existing caller (and every already-created offer) keeps behaving exactly
-- as before.

-- A plain CHECK constraint cannot contain a subquery (Postgres rejects it
-- outright, even a decorrelated EXISTS over unnest()), so the "every element
-- is https://" rule is expressed as a small immutable function instead and
-- called from the constraint — the constraint itself stays a single
-- function-call expression, which Postgres does allow.
create or replace function private.all_https(p_urls text[]) returns boolean
language plpgsql immutable as $$
declare u text;
begin
  if p_urls is null then return true; end if;
  foreach u in array p_urls loop
    if u !~* '^https://' then return false; end if;
  end loop;
  return true;
end $$;
revoke all on function private.all_https(text[]) from public, anon, authenticated;

alter table public.offers
  add column if not exists product_label text,
  add column if not exists cta_label text,
  add column if not exists image_urls text[] not null default '{}';

comment on column public.offers.product_label is
  'Optional vendor-supplied product/item name shown instead of the offer title on the commerce CTA, e.g. a specific Etsy listing name.';
comment on column public.offers.cta_label is
  'Optional vendor-supplied button text for the destination_url CTA, e.g. "Shop on Etsy". Falls back to a smart default in the UI when unset.';
comment on column public.offers.image_urls is
  'Zero or more vendor-supplied HTTPS image URLs for the offer card/gallery, distinct from the single confirmed image_url. Validated HTTPS-only at write time in create_partner_offer/revise_partner_offer; this column is new (no existing rows), so a check constraint is safe here unlike the older destination_url/image_url columns.';

alter table public.offers
  add constraint offers_image_urls_https_only check (private.all_https(image_urls));

drop function if exists public.public_active_offers(uuid, public.market_channel, uuid);

create function public.public_active_offers(
  p_organization_id uuid default null,
  p_channel public.market_channel default null,
  p_event_id uuid default null
)
returns table(
  offer_id uuid,
  organization_id uuid,
  business_name text,
  version_id uuid,
  title text,
  summary text,
  details text,
  terms text,
  classification text,
  channel public.market_channel,
  category text,
  image_url text,
  destination_url text,
  eligibility text,
  last_verified_at timestamptz,
  eligibility_kind text,
  starts_at timestamptz,
  ends_at timestamptz,
  redemption_instructions text,
  source_url text,
  disclosure text,
  applicability text[],
  event_id uuid,
  product_label text,
  cta_label text,
  image_urls text[]
)
language sql
stable
security definer
set search_path=''
as $$
  select
    o.id,
    o.organization_id,
    g.public_name,
    v.id,
    v.title,
    v.summary,
    v.details,
    v.terms,
    o.classification,
    o.channel,
    o.category,
    case when o.image_confirmed_at is not null then o.image_url else null end,
    o.destination_url,
    o.eligibility,
    o.last_verified_at,
    v.eligibility_kind,
    v.starts_at,
    v.ends_at,
    v.redemption_instructions,
    v.source_url,
    v.disclosure,
    array(
      select ol.applicability
      from public.offer_locations ol
      where ol.offer_version_id = v.id
      order by ol.applicability
    ),
    o.event_id,
    o.product_label,
    o.cta_label,
    o.image_urls
  from public.offers o
  join public.offer_versions v on v.id = o.current_version_id
  join public.organizations g on g.id = o.organization_id
  where o.status = 'active'
    and v.status = 'published'
    and (v.starts_at is null or v.starts_at <= now())
    and (v.ends_at is null or v.ends_at > now())
    and o.classification not in ('internal', 'reference')
    and o.is_demo = false
    and g.is_demo = false
    and (p_organization_id is null or o.organization_id = p_organization_id)
    and (p_channel is null or o.channel = p_channel or o.channel = 'shared')
    and (p_event_id is null or o.event_id = p_event_id)
$$;

revoke all on function public.public_active_offers(uuid, public.market_channel, uuid) from public;
grant execute on function public.public_active_offers(uuid, public.market_channel, uuid) to anon, authenticated;

-- Shared HTTPS-only validation for vendor-supplied commerce links, used by
-- both create and revise below. Raising here is defense in depth alongside
-- client-side validation, and covers the RPC path directly (e.g. API
-- callers), not just the OfferManager form.
create or replace function private.assert_https_or_empty(p_label text, p_url text) returns void
language plpgsql as $$
begin
  if p_url is not null and p_url <> '' and p_url !~* '^https://' then
    raise exception '% must be a valid https:// URL', p_label;
  end if;
end $$;
revoke all on function private.assert_https_or_empty(text, text) from public, anon, authenticated;

create or replace function public.create_partner_offer(p_organization_id uuid, p_terms jsonb) returns uuid
language plpgsql security definer set search_path='' as $$
declare o uuid:=gen_random_uuid(); v uuid:=gen_random_uuid(); dest text; imgs text[];
begin
  if not private.can_manage_org(p_organization_id,array['owner','administrator','publisher']) then raise exception 'Not authorized' using errcode='42501'; end if;
  if coalesce(trim(p_terms->>'title'),'')='' or coalesce(trim(p_terms->>'summary'),'')='' then raise exception 'Title and summary are required'; end if;
  dest := coalesce(nullif(p_terms->>'destination_url',''), nullif(p_terms->>'source_url',''));
  perform private.assert_https_or_empty('Product/store link', dest);
  imgs := coalesce((select array_agg(value) from jsonb_array_elements_text(coalesce(p_terms->'image_urls','[]'::jsonb))), array[]::text[]);
  if not private.all_https(imgs) then raise exception 'Product images must be https:// URLs'; end if;
  insert into public.offers(id,organization_id,created_by,channel,title,summary,details,category,classification,destination_url,eligibility,redemption_instructions,starts_at,expires_at,status,is_demo,current_version_id,event_id,product_label,cta_label,image_urls)
  values(o,p_organization_id,auth.uid(),coalesce((p_terms->>'channel')::public.market_channel,'pet'),p_terms->>'title',p_terms->>'summary',p_terms->>'details',coalesce(p_terms->>'category','General'),coalesce(p_terms->>'classification','partner_published'),dest,p_terms->>'eligibility_kind',p_terms->>'redemption_instructions',nullif(p_terms->>'starts_at','')::timestamptz,nullif(p_terms->>'ends_at','')::timestamptz,'draft',false,null,nullif(p_terms->>'event_id','')::uuid,nullif(p_terms->>'product_label',''),nullif(p_terms->>'cta_label',''),imgs);
  insert into public.offer_versions(id,offer_id,version_number,title,summary,details,terms,starts_at,ends_at,availability_limit,status,created_by,eligibility_kind,claim_window_days,per_user_limit,per_pet_limit,redemption_instructions,source_url,disclosure)
  values(v,o,1,p_terms->>'title',p_terms->>'summary',p_terms->>'details',p_terms->>'terms',nullif(p_terms->>'starts_at','')::timestamptz,nullif(p_terms->>'ends_at','')::timestamptz,nullif(p_terms->>'availability_limit','')::integer,'draft',auth.uid(),coalesce(p_terms->>'eligibility_kind','all_pets'),coalesce(nullif(p_terms->>'claim_window_days','')::integer,30),nullif(p_terms->>'per_user_limit','')::integer,nullif(p_terms->>'per_pet_limit','')::integer,p_terms->>'redemption_instructions',nullif(p_terms->>'source_url',''),p_terms->>'disclosure');
  insert into public.offer_locations(offer_version_id,applicability) values(v,coalesce(p_terms->>'applicability','online'));
  update public.offers set current_version_id=v where id=o;
  insert into private.audit_events(actor_id,action,target_type,target_id,outcome) values(auth.uid(),'offer.create','offer',o,'success');
  return o;
end $$;

create or replace function public.revise_partner_offer(p_offer_id uuid, p_terms jsonb) returns uuid
language plpgsql security definer set search_path='' as $$
declare o public.offers; v uuid:=gen_random_uuid(); n integer; dest text; imgs text[];
begin
  o:=private.assert_offer_manager(p_offer_id);
  if coalesce(trim(p_terms->>'title'),'')='' or coalesce(trim(p_terms->>'summary'),'')='' then raise exception 'Title and summary are required'; end if;
  dest := coalesce(nullif(p_terms->>'destination_url',''), nullif(p_terms->>'source_url',''));
  perform private.assert_https_or_empty('Product/store link', dest);
  imgs := coalesce((select array_agg(value) from jsonb_array_elements_text(coalesce(p_terms->'image_urls','[]'::jsonb))), array[]::text[]);
  if not private.all_https(imgs) then raise exception 'Product images must be https:// URLs'; end if;
  select coalesce(max(version_number),0)+1 into n from public.offer_versions where offer_id=p_offer_id;
  insert into public.offer_versions(id,offer_id,version_number,title,summary,details,terms,starts_at,ends_at,availability_limit,status,created_by,eligibility_kind,claim_window_days,per_user_limit,per_pet_limit,redemption_instructions,source_url,disclosure)
  values(v,p_offer_id,n,p_terms->>'title',p_terms->>'summary',p_terms->>'details',p_terms->>'terms',nullif(p_terms->>'starts_at','')::timestamptz,nullif(p_terms->>'ends_at','')::timestamptz,nullif(p_terms->>'availability_limit','')::integer,'draft',auth.uid(),coalesce(p_terms->>'eligibility_kind','all_pets'),coalesce(nullif(p_terms->>'claim_window_days','')::integer,30),nullif(p_terms->>'per_user_limit','')::integer,nullif(p_terms->>'per_pet_limit','')::integer,p_terms->>'redemption_instructions',nullif(p_terms->>'source_url',''),p_terms->>'disclosure');
  insert into public.offer_locations(offer_version_id,applicability) values(v,coalesce(p_terms->>'applicability','online'));
  update public.offers set current_version_id=v,title=p_terms->>'title',summary=p_terms->>'summary',details=p_terms->>'details',event_id=nullif(p_terms->>'event_id','')::uuid,destination_url=dest,product_label=nullif(p_terms->>'product_label',''),cta_label=nullif(p_terms->>'cta_label',''),image_urls=imgs,updated_at=now() where id=p_offer_id;
  return v;
end $$;

create or replace function public.duplicate_partner_offer(p_offer_id uuid) returns uuid
language plpgsql security definer set search_path='' as $$
declare o public.offers; v public.offer_versions;
begin
  o:=private.assert_offer_manager(p_offer_id); select * into v from public.offer_versions where id=o.current_version_id;
  return public.create_partner_offer(o.organization_id,jsonb_build_object('title',v.title||' (copy)','summary',v.summary,'details',v.details,'terms',v.terms,'channel',o.channel,'category',o.category,'classification',o.classification,'starts_at',v.starts_at,'ends_at',v.ends_at,'availability_limit',v.availability_limit,'eligibility_kind',v.eligibility_kind,'claim_window_days',v.claim_window_days,'per_user_limit',v.per_user_limit,'per_pet_limit',v.per_pet_limit,'redemption_instructions',v.redemption_instructions,'source_url',v.source_url,'disclosure',v.disclosure,'applicability',(select ol.applicability from public.offer_locations ol where ol.offer_version_id=v.id order by ol.id limit 1),'event_id',o.event_id,'destination_url',o.destination_url,'product_label',o.product_label,'cta_label',o.cta_label,'image_urls',to_jsonb(o.image_urls)));
end $$;
