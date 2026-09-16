-- Issue #283 P1 persistence recovery.
-- Existing edits must persist a channel change; media upload must be able to
-- attach its already-authorized Storage object immediately after upload.
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
  update public.offers set current_version_id=v,title=p_terms->>'title',summary=p_terms->>'summary',details=p_terms->>'details',event_id=nullif(p_terms->>'event_id','')::uuid,destination_url=dest,product_label=nullif(p_terms->>'product_label',''),cta_label=nullif(p_terms->>'cta_label',''),image_urls=imgs,image_path=nullif(p_terms->>'image_path',''),channel=coalesce((p_terms->>'channel')::public.market_channel,o.channel),updated_at=now() where id=p_offer_id;
  return v;
end $$;

create or replace function public.set_partner_offer_image_path(
  p_offer_id uuid,
  p_image_path text
) returns void
language plpgsql security definer set search_path='' as $$
declare o public.offers;
begin
  o := private.assert_offer_manager(p_offer_id);
  if p_image_path is not null and p_image_path <> '' then
    if p_image_path !~ ('^' || o.organization_id::text || '/' || p_offer_id::text || '/cover\\.(jpg|png|webp)$') then
      raise exception 'Invalid offer image path' using errcode='22023';
    end if;
  end if;
  update public.offers
  set image_path = nullif(p_image_path, ''), updated_at = now()
  where id = p_offer_id;
end $$;

revoke all on function public.set_partner_offer_image_path(uuid, text) from public;
grant execute on function public.set_partner_offer_image_path(uuid, text) to authenticated;
