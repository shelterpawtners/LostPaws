-- Issue #283 P1-D: real image uploads for Events and Offers.
--
-- Bucket is deliberately PUBLIC for read, unlike profile-avatars
-- (20260911084500), because offer/event photos must render on the public
-- Marketplace/Event surfaces for signed-out visitors -- the same audience
-- that already sees the plain-text image_url/image_urls fields today. A
-- public bucket serves objects via a stable getPublicUrl() with no RLS
-- read policy needed, matching that existing simplicity.
--
-- The actual security requirement here is write ownership: prevent one
-- vendor/org from overwriting or deleting another's media. That is
-- enforced by RLS on storage.objects for insert/update/delete only,
-- keyed off the object path's leading segment, reusing the exact
-- private.can_manage_org authorization already used for offers/events
-- everywhere else in the schema -- no new authorization concept.
--
-- Path convention: {organization_id}/{offer_or_event_id}/{filename}.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values (
  'event-offer-media',
  'event-offer-media',
  true,
  5242880,
  array['image/jpeg','image/png','image/webp']
)
on conflict(id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists org_media_add on storage.objects;
create policy org_media_add
on storage.objects for insert to authenticated
with check (
  bucket_id = 'event-offer-media'
  and private.can_manage_org(((storage.foldername(name))[1])::uuid, array['owner','administrator','publisher'])
);

drop policy if exists org_media_update on storage.objects;
create policy org_media_update
on storage.objects for update to authenticated
using (
  bucket_id = 'event-offer-media'
  and private.can_manage_org(((storage.foldername(name))[1])::uuid, array['owner','administrator','publisher'])
)
with check (
  bucket_id = 'event-offer-media'
  and private.can_manage_org(((storage.foldername(name))[1])::uuid, array['owner','administrator','publisher'])
);

drop policy if exists org_media_delete on storage.objects;
create policy org_media_delete
on storage.objects for delete to authenticated
using (
  bucket_id = 'event-offer-media'
  and private.can_manage_org(((storage.foldername(name))[1])::uuid, array['owner','administrator','publisher'])
);

-- Durable reference to the uploaded object's path, distinct from the
-- existing free-text image_url/image_urls columns which remain the
-- optional secondary/legacy path (e.g. an external Etsy listing photo).
alter table public.offers add column if not exists image_path text;
alter table public.events add column if not exists image_path text;

-- public_active_offers must expose image_path so the public Marketplace can
-- render an uploaded photo. Changing a set-returning function's output
-- columns requires DROP + CREATE, not CREATE OR REPLACE -- done here in one
-- transaction so no concurrent reader observes an in-between state, the
-- same established pattern used in prior offer-shape migrations.
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
  image_urls text[],
  image_path text
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
    o.image_urls,
    o.image_path
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

-- create_partner_offer/revise_partner_offer already take a single p_terms
-- jsonb blob and pick out the fields they understand (event_id,
-- product_label, cta_label, image_urls, ...) -- adding image_path here is
-- the same shape of change, not a new function signature, so
-- CREATE OR REPLACE is sufficient (neither returns a table).
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
  insert into public.offers(id,organization_id,created_by,channel,title,summary,details,category,classification,destination_url,eligibility,redemption_instructions,starts_at,expires_at,status,is_demo,current_version_id,event_id,product_label,cta_label,image_urls,image_path)
  values(o,p_organization_id,auth.uid(),coalesce((p_terms->>'channel')::public.market_channel,'pet'),p_terms->>'title',p_terms->>'summary',p_terms->>'details',coalesce(p_terms->>'category','General'),coalesce(p_terms->>'classification','partner_published'),dest,p_terms->>'eligibility_kind',p_terms->>'redemption_instructions',nullif(p_terms->>'starts_at','')::timestamptz,nullif(p_terms->>'ends_at','')::timestamptz,'draft',false,null,nullif(p_terms->>'event_id','')::uuid,nullif(p_terms->>'product_label',''),nullif(p_terms->>'cta_label',''),imgs,nullif(p_terms->>'image_path',''));
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
  update public.offers set current_version_id=v,title=p_terms->>'title',summary=p_terms->>'summary',details=p_terms->>'details',event_id=nullif(p_terms->>'event_id','')::uuid,destination_url=dest,product_label=nullif(p_terms->>'product_label',''),cta_label=nullif(p_terms->>'cta_label',''),image_urls=imgs,image_path=nullif(p_terms->>'image_path',''),updated_at=now() where id=p_offer_id;
  return v;
end $$;
