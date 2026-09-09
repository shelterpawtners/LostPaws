-- Phase 2 checkpoints 3 and 4: immutable offers and opaque-code redemption.
alter table public.offer_versions
  add column if not exists eligibility_kind text not null default 'all_pets'
    check (eligibility_kind in ('all_pets','shelter_pet_enhanced')),
  add column if not exists claim_window_days integer not null default 30
    check (claim_window_days between 1 and 90),
  add column if not exists per_user_limit integer check (per_user_limit is null or per_user_limit > 0),
  add column if not exists per_pet_limit integer check (per_pet_limit is null or per_pet_limit > 0),
  add column if not exists redemption_instructions text,
  add column if not exists source_url text,
  add column if not exists disclosure text;

alter table public.offer_claims
  add column if not exists token_id uuid references private.secure_tokens(id),
  add column if not exists cancelled_at timestamptz;
create unique index if not exists offer_claims_token_unique on public.offer_claims(token_id) where token_id is not null;

drop policy if exists offer_read on public.offers;
drop policy if exists member_offer_add on public.offers;
drop policy if exists member_offer_edit on public.offers;
create policy offer_manager_read on public.offers for select to authenticated
using (organization_id is not null and private.can_manage_org(organization_id,array['owner','administrator','publisher','member']));
create policy offer_locations_manager_read on public.offer_locations for select to authenticated
using (exists(select 1 from public.offer_versions v join public.offers o on o.id=v.offer_id where v.id=offer_version_id and private.can_manage_org(o.organization_id,array['owner','administrator','publisher','member'])));
revoke select,insert,update,delete on public.offers from anon;
revoke insert,update,delete on public.offers,public.offer_versions,public.offer_eligibility_rules,public.offer_locations from authenticated;
grant select on public.offers,public.offer_versions,public.offer_eligibility_rules,public.offer_locations to authenticated;

create table if not exists public.redemption_events (
  id bigint generated always as identity primary key,
  redemption_id uuid not null references public.redemptions(id),
  event_type text not null check (event_type in ('confirmed','reversed','disputed','corrected')),
  actor_id uuid not null references public.profiles(id),
  reason text,
  created_at timestamptz not null default now()
);
alter table public.redemption_events enable row level security;
create policy redemption_events_involved_read on public.redemption_events for select to authenticated
using (exists (select 1 from public.redemptions r where r.id=redemption_id and
  (r.guardian_id=(select auth.uid()) or private.can_manage_org(r.partner_organization_id,array['owner','administrator','publisher','member']))));
revoke insert,update,delete on public.redemption_events from authenticated;
grant select on public.redemption_events to authenticated;

create or replace function private.assert_offer_manager(p_offer uuid) returns public.offers
language plpgsql security definer set search_path='' as $$
declare v public.offers;
begin
  select * into v from public.offers where id=p_offer for update;
  if v.id is null or not private.can_manage_org(v.organization_id,array['owner','administrator','publisher']) then
    raise exception 'Not authorized to manage this offer' using errcode='42501';
  end if;
  return v;
end $$;
revoke all on function private.assert_offer_manager(uuid) from public,anon,authenticated;

create or replace function public.create_partner_offer(p_organization_id uuid,p_terms jsonb) returns uuid
language plpgsql security definer set search_path='' as $$
declare o uuid:=gen_random_uuid(); v uuid:=gen_random_uuid();
begin
  if not private.can_manage_org(p_organization_id,array['owner','administrator','publisher']) then raise exception 'Not authorized' using errcode='42501'; end if;
  if coalesce(trim(p_terms->>'title'),'')='' or coalesce(trim(p_terms->>'summary'),'')='' then raise exception 'Title and summary are required'; end if;
  insert into public.offers(id,organization_id,created_by,channel,title,summary,details,category,classification,destination_url,eligibility,redemption_instructions,starts_at,expires_at,status,is_demo,current_version_id)
  values(o,p_organization_id,auth.uid(),coalesce((p_terms->>'channel')::public.market_channel,'pet'),p_terms->>'title',p_terms->>'summary',p_terms->>'details',coalesce(p_terms->>'category','General'),coalesce(p_terms->>'classification','partner_published'),nullif(p_terms->>'source_url',''),p_terms->>'eligibility_kind',p_terms->>'redemption_instructions',nullif(p_terms->>'starts_at','')::timestamptz,nullif(p_terms->>'ends_at','')::timestamptz,'draft',false,null);
  insert into public.offer_versions(id,offer_id,version_number,title,summary,details,terms,starts_at,ends_at,availability_limit,status,created_by,eligibility_kind,claim_window_days,per_user_limit,per_pet_limit,redemption_instructions,source_url,disclosure)
  values(v,o,1,p_terms->>'title',p_terms->>'summary',p_terms->>'details',p_terms->>'terms',nullif(p_terms->>'starts_at','')::timestamptz,nullif(p_terms->>'ends_at','')::timestamptz,nullif(p_terms->>'availability_limit','')::integer,'draft',auth.uid(),coalesce(p_terms->>'eligibility_kind','all_pets'),coalesce(nullif(p_terms->>'claim_window_days','')::integer,30),nullif(p_terms->>'per_user_limit','')::integer,nullif(p_terms->>'per_pet_limit','')::integer,p_terms->>'redemption_instructions',nullif(p_terms->>'source_url',''),p_terms->>'disclosure');
  insert into public.offer_locations(offer_version_id,applicability) values(v,coalesce(p_terms->>'applicability','online'));
  update public.offers set current_version_id=v where id=o;
  insert into private.audit_events(actor_id,action,target_type,target_id,outcome) values(auth.uid(),'offer.create','offer',o,'success');
  return o;
end $$;

create or replace function public.revise_partner_offer(p_offer_id uuid,p_terms jsonb) returns uuid
language plpgsql security definer set search_path='' as $$
declare o public.offers; v uuid:=gen_random_uuid(); n integer;
begin
  o:=private.assert_offer_manager(p_offer_id);
  if coalesce(trim(p_terms->>'title'),'')='' or coalesce(trim(p_terms->>'summary'),'')='' then raise exception 'Title and summary are required'; end if;
  select coalesce(max(version_number),0)+1 into n from public.offer_versions where offer_id=p_offer_id;
  insert into public.offer_versions(id,offer_id,version_number,title,summary,details,terms,starts_at,ends_at,availability_limit,status,created_by,eligibility_kind,claim_window_days,per_user_limit,per_pet_limit,redemption_instructions,source_url,disclosure)
  values(v,p_offer_id,n,p_terms->>'title',p_terms->>'summary',p_terms->>'details',p_terms->>'terms',nullif(p_terms->>'starts_at','')::timestamptz,nullif(p_terms->>'ends_at','')::timestamptz,nullif(p_terms->>'availability_limit','')::integer,'draft',auth.uid(),coalesce(p_terms->>'eligibility_kind','all_pets'),coalesce(nullif(p_terms->>'claim_window_days','')::integer,30),nullif(p_terms->>'per_user_limit','')::integer,nullif(p_terms->>'per_pet_limit','')::integer,p_terms->>'redemption_instructions',nullif(p_terms->>'source_url',''),p_terms->>'disclosure');
  insert into public.offer_locations(offer_version_id,applicability) values(v,coalesce(p_terms->>'applicability','online'));
  update public.offers set current_version_id=v,title=p_terms->>'title',summary=p_terms->>'summary',details=p_terms->>'details',updated_at=now() where id=p_offer_id;
  return v;
end $$;

create or replace function public.set_partner_offer_state(p_offer_id uuid,p_action text) returns text
language plpgsql security definer set search_path='' as $$
declare o public.offers; v public.offer_versions; s text;
begin
  o:=private.assert_offer_manager(p_offer_id);
  select * into v from public.offer_versions where id=o.current_version_id for update;
  if p_action='publish' or p_action='resume' then
    if coalesce(trim(v.title),'')='' or coalesce(trim(v.summary),'')='' or coalesce(trim(v.terms),'')='' or coalesce(trim(v.redemption_instructions),'')='' then raise exception 'Title, summary, terms, and redemption instructions are required'; end if;
    if v.ends_at is not null and v.ends_at<=now() then raise exception 'Expired terms cannot be published'; end if;
    s:=case when v.starts_at is not null and v.starts_at>now() then 'scheduled' else 'published' end;
    update public.offer_versions set status=s,published_at=coalesce(published_at,now()) where id=v.id;
    update public.offers set status='active',published_at=coalesce(published_at,now()),suspended_at=null where id=o.id;
  elsif p_action='pause' then s:='paused'; update public.offer_versions set status=s where id=v.id; update public.offers set status='suspended',suspended_at=now() where id=o.id;
  elsif p_action='archive' then s:='archived'; update public.offer_versions set status=s where id=v.id; update public.offers set status='expired' where id=o.id;
  elsif p_action='expire' then s:='expired'; update public.offer_versions set status=s where id=v.id; update public.offers set status='expired' where id=o.id;
  else raise exception 'Unsupported offer action'; end if;
  insert into private.audit_events(actor_id,action,target_type,target_id,outcome,context) values(auth.uid(),'offer.'||p_action,'offer',o.id,'success',jsonb_build_object('version_id',v.id));
  return s;
end $$;

create or replace function public.duplicate_partner_offer(p_offer_id uuid) returns uuid
language plpgsql security definer set search_path='' as $$
declare o public.offers; v public.offer_versions;
begin
  o:=private.assert_offer_manager(p_offer_id); select * into v from public.offer_versions where id=o.current_version_id;
  return public.create_partner_offer(o.organization_id,jsonb_build_object('title',v.title||' (copy)','summary',v.summary,'details',v.details,'terms',v.terms,'channel',o.channel,'category',o.category,'classification',o.classification,'starts_at',v.starts_at,'ends_at',v.ends_at,'availability_limit',v.availability_limit,'eligibility_kind',v.eligibility_kind,'claim_window_days',v.claim_window_days,'per_user_limit',v.per_user_limit,'per_pet_limit',v.per_pet_limit,'redemption_instructions',v.redemption_instructions,'source_url',v.source_url,'disclosure',v.disclosure,'applicability',(select ol.applicability from public.offer_locations ol where ol.offer_version_id=v.id order by ol.id limit 1)));
end $$;

create or replace function public.public_active_offers(p_organization_id uuid default null) returns table(offer_id uuid,organization_id uuid,business_name text,version_id uuid,title text,summary text,details text,terms text,classification text,eligibility_kind text,starts_at timestamptz,ends_at timestamptz,redemption_instructions text,source_url text,disclosure text,applicability text[])
language sql stable security definer set search_path='' as $$
 select o.id,o.organization_id,g.public_name,v.id,v.title,v.summary,v.details,v.terms,o.classification,v.eligibility_kind,v.starts_at,v.ends_at,v.redemption_instructions,v.source_url,v.disclosure,
 array(select ol.applicability from public.offer_locations ol where ol.offer_version_id=v.id order by ol.applicability)
 from public.offers o join public.offer_versions v on v.id=o.current_version_id join public.organizations g on g.id=o.organization_id
 where o.status='active' and v.status='published' and (v.starts_at is null or v.starts_at<=now()) and (v.ends_at is null or v.ends_at>now()) and o.classification not in ('internal','reference') and (p_organization_id is null or o.organization_id=p_organization_id);
$$;

create or replace function public.claim_offer(p_offer_id uuid,p_pet_id uuid default null) returns table(claim_id uuid,redeem_code text,expires_at timestamptz)
language plpgsql security definer set search_path='' as $$
declare o public.offers; v public.offer_versions; c uuid:=gen_random_uuid(); t uuid:=gen_random_uuid(); raw text:=replace(gen_random_uuid()::text,'-','')||replace(gen_random_uuid()::text,'-',''); exp timestamptz; used integer;
begin
  if auth.uid() is null then raise exception 'Authentication required' using errcode='42501'; end if;
  select * into o from public.offers where id=p_offer_id for update; select * into v from public.offer_versions where id=o.current_version_id for update;
  if o.status<>'active' or v.status<>'published' or (v.starts_at is not null and v.starts_at>now()) or (v.ends_at is not null and v.ends_at<=now()) then raise exception 'Offer is not claimable'; end if;
  if p_pet_id is not null and not exists(select 1 from public.guardianships g where g.pet_id=p_pet_id and g.guardian_id=auth.uid() and g.status='active') then raise exception 'Pet is not under your guardianship' using errcode='42501'; end if;
  select count(*) into used from public.offer_claims where offer_version_id=v.id and status in ('claimed','reserved','utilized');
  if v.availability_limit is not null and used>=v.availability_limit then raise exception 'Offer inventory is no longer available'; end if;
  if v.per_user_limit is not null and (select count(*) from public.offer_claims where offer_version_id=v.id and guardian_id=auth.uid() and status<>'cancelled')>=v.per_user_limit then raise exception 'Per-user claim limit reached'; end if;
  if p_pet_id is not null and v.per_pet_limit is not null and (select count(*) from public.offer_claims where offer_version_id=v.id and pet_id=p_pet_id and status<>'cancelled')>=v.per_pet_limit then raise exception 'Per-pet claim limit reached'; end if;
  exp:=least(now()+make_interval(days=>v.claim_window_days),coalesce(v.ends_at,'infinity'));
  insert into private.secure_tokens(id,purpose,token_digest,target_type,target_id,expires_at,created_by) values(t,'guardian_redemption',encode(extensions.digest(raw,'sha256'),'hex'),'offer_claim',c,exp,auth.uid());
  insert into public.offer_claims(id,offer_id,offer_version_id,guardian_id,pet_id,status,expires_at,token_id) values(c,o.id,v.id,auth.uid(),p_pet_id,'claimed',exp,t);
  insert into private.audit_events(actor_id,action,target_type,target_id,outcome) values(auth.uid(),'offer.claim','offer_claim',c,'success');
  return query select c,raw,exp;
end $$;

create or replace function public.validate_redemption_code(p_code text) returns table(claim_id uuid,offer_title text,business_name text,expires_at timestamptz,status text)
language plpgsql security definer set search_path='' as $$
begin
 return query select c.id,v.title,g.public_name,c.expires_at,c.status from private.secure_tokens t join public.offer_claims c on c.id=t.target_id join public.offers o on o.id=c.offer_id join public.offer_versions v on v.id=c.offer_version_id join public.organizations g on g.id=o.organization_id
 where t.token_digest=encode(extensions.digest(p_code,'sha256'),'hex') and t.purpose='guardian_redemption' and t.revoked_at is null and t.used_at is null and (t.expires_at is null or t.expires_at>now()) and c.status in ('claimed','reserved') and private.can_manage_org(o.organization_id,array['owner','administrator','publisher','member']);
end $$;

create or replace function public.confirm_redemption(p_code text,p_location_id uuid default null) returns uuid
language plpgsql security definer set search_path='' as $$
declare t private.secure_tokens; c public.offer_claims; o public.offers; r uuid:=gen_random_uuid();
begin
 select * into t from private.secure_tokens where token_digest=encode(extensions.digest(p_code,'sha256'),'hex') and purpose='guardian_redemption' for update;
 if t.id is null or t.revoked_at is not null or t.used_at is not null or (t.expires_at is not null and t.expires_at<=now()) then raise exception 'Code is invalid, expired, or already used'; end if;
 select * into c from public.offer_claims where id=t.target_id for update; select * into o from public.offers where id=c.offer_id;
 if not private.can_manage_org(o.organization_id,array['owner','administrator','publisher','member']) then raise exception 'Not authorized for this Partner' using errcode='42501'; end if;
 if c.status not in ('claimed','reserved') then raise exception 'Claim cannot be utilized'; end if;
 insert into public.redemptions(id,claim_id,offer_id,offer_version_id,guardian_id,pet_id,partner_organization_id,organization_location_id,verification_method,confirmed_by,confirmed_at,status,is_demo) values(r,c.id,c.offer_id,c.offer_version_id,c.guardian_id,c.pet_id,o.organization_id,p_location_id,'opaque_code',auth.uid(),now(),'confirmed',c.is_demo);
 update public.offer_claims set status='utilized' where id=c.id; update private.secure_tokens set used_at=now() where id=t.id;
 insert into public.redemption_events(redemption_id,event_type,actor_id) values(r,'confirmed',auth.uid());
 insert into private.audit_events(actor_id,action,target_type,target_id,outcome,context) values(auth.uid(),'redemption.confirm','redemption',r,'success',jsonb_build_object('claim_id',c.id,'offer_version_id',c.offer_version_id));
 return r;
end $$;

create or replace function public.reverse_redemption(p_redemption_id uuid,p_reason text) returns void
language plpgsql security definer set search_path='' as $$
declare r public.redemptions;
begin
 select * into r from public.redemptions where id=p_redemption_id for update;
 if r.id is null or not private.can_manage_org(r.partner_organization_id,array['owner','administrator','publisher']) then raise exception 'Not authorized' using errcode='42501'; end if;
 if r.status<>'confirmed' then raise exception 'Only confirmed redemptions can be reversed'; end if;
 update public.redemptions set status='reversed' where id=r.id;
 insert into public.redemption_events(redemption_id,event_type,actor_id,reason) values(r.id,'reversed',auth.uid(),nullif(trim(p_reason),''));
 insert into private.audit_events(actor_id,action,target_type,target_id,outcome) values(auth.uid(),'redemption.reverse','redemption',r.id,'success');
end $$;

drop policy if exists claims_guardian_add on public.offer_claims;
drop policy if exists claims_involved_update on public.offer_claims;
drop policy if exists redemptions_partner_add on public.redemptions;
revoke insert,update,delete on public.offer_claims,public.redemptions from authenticated;

grant execute on function public.create_partner_offer(uuid,jsonb),public.revise_partner_offer(uuid,jsonb),public.set_partner_offer_state(uuid,text),public.duplicate_partner_offer(uuid),public.claim_offer(uuid,uuid),public.validate_redemption_code(text),public.confirm_redemption(text,uuid),public.reverse_redemption(uuid,text) to authenticated;
grant execute on function public.public_active_offers(uuid) to anon,authenticated;
