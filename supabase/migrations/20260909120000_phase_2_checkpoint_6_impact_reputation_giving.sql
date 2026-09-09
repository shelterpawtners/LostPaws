-- Phase 2 Checkpoint 6: provider-agnostic impact, reputation, and giving foundation.
-- This migration intentionally does not move money, select a production giving
-- provider, issue charitable receipts, or resolve customer-facing verified-savings rules.

create table public.partner_contribution_commitments (
  id uuid primary key default gen_random_uuid(),
  partner_organization_id uuid not null references public.organizations(id) on delete cascade,
  commitment_kind text not null check (commitment_kind in ('fixed_per_redemption','percent_of_paid_amount','recurring','one_time_campaign')),
  designated_recipient_organization_id uuid references public.organizations(id),
  amount_minor bigint check (amount_minor is null or amount_minor > 0),
  percentage_bps integer check (percentage_bps is null or percentage_bps between 1 and 10000),
  currency_code char(3) not null default 'USD',
  cadence text check (cadence is null or cadence in ('monthly','quarterly','annual')),
  campaign_code text,
  public_description text,
  status text not null default 'draft' check (status in ('draft','active','paused','ended')),
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid not null references public.profiles(id),
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at),
  check (
    (commitment_kind='fixed_per_redemption' and amount_minor is not null and percentage_bps is null and cadence is null)
    or (commitment_kind='percent_of_paid_amount' and percentage_bps is not null and amount_minor is null and cadence is null)
    or (commitment_kind='recurring' and amount_minor is not null and percentage_bps is null and cadence is not null)
    or (commitment_kind='one_time_campaign' and amount_minor is not null and percentage_bps is null and cadence is null)
  )
);

create table public.partner_contribution_settlement_evidence (
  id uuid primary key default gen_random_uuid(),
  partner_organization_id uuid not null references public.organizations(id) on delete cascade,
  commitment_id uuid references public.partner_contribution_commitments(id),
  recipient_organization_id uuid not null references public.organizations(id),
  amount_minor bigint not null check (amount_minor > 0),
  currency_code char(3) not null default 'USD',
  settled_at timestamptz not null,
  evidence_reference text not null,
  evidence_metadata jsonb not null default '{}'::jsonb,
  submitted_by uuid not null references public.profiles(id),
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.partner_contribution_evidence_reviews (
  id bigint generated always as identity primary key,
  evidence_id uuid not null references public.partner_contribution_settlement_evidence(id),
  review_action text not null check (review_action in ('verified','rejected','revoked')),
  reason text not null,
  reviewed_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.partner_good_standing_reviews (
  id bigint generated always as identity primary key,
  partner_organization_id uuid not null references public.organizations(id) on delete cascade,
  review_state text not null check (review_state in ('good_standing','not_good_standing')),
  reason text not null,
  reviewed_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.donation_intents
  add column if not exists commitment_id uuid references public.partner_contribution_commitments(id),
  add column if not exists designated_recipient_organization_id uuid references public.organizations(id),
  add column if not exists redemption_id uuid references public.redemptions(id),
  add column if not exists economic_event_id uuid references public.economic_events(id),
  add column if not exists cancelled_at timestamptz,
  add column if not exists cancellation_reason text;

create unique index if not exists donation_intents_commitment_redemption_unique
  on public.donation_intents(commitment_id, redemption_id)
  where commitment_id is not null and redemption_id is not null;
create index partner_contribution_commitments_org_status_idx
  on public.partner_contribution_commitments(partner_organization_id,status,created_at desc);
create index partner_contribution_evidence_org_idx
  on public.partner_contribution_settlement_evidence(partner_organization_id,created_at desc);
create index partner_contribution_evidence_review_idx
  on public.partner_contribution_evidence_reviews(evidence_id,created_at desc,id desc);
create index partner_good_standing_review_org_idx
  on public.partner_good_standing_reviews(partner_organization_id,created_at desc,id desc);
create index donation_intents_redemption_idx
  on public.donation_intents(redemption_id) where redemption_id is not null;

alter table public.partner_contribution_commitments enable row level security;
alter table public.partner_contribution_settlement_evidence enable row level security;
alter table public.partner_contribution_evidence_reviews enable row level security;
alter table public.partner_good_standing_reviews enable row level security;

create policy contribution_commitments_involved_read
on public.partner_contribution_commitments for select to authenticated
using (private.is_platform_admin() or private.can_manage_org(partner_organization_id,array['owner','administrator','publisher','member']));
create policy contribution_evidence_involved_read
on public.partner_contribution_settlement_evidence for select to authenticated
using (private.is_platform_admin() or private.can_manage_org(partner_organization_id,array['owner','administrator','publisher','member']));
create policy contribution_evidence_reviews_involved_read
on public.partner_contribution_evidence_reviews for select to authenticated
using (
  private.is_platform_admin()
  or exists(
    select 1 from public.partner_contribution_settlement_evidence e
    where e.id=evidence_id
      and private.can_manage_org(e.partner_organization_id,array['owner','administrator','publisher','member'])
  )
);
create policy partner_good_standing_involved_read
on public.partner_good_standing_reviews for select to authenticated
using (private.is_platform_admin() or private.can_manage_org(partner_organization_id,array['owner','administrator','publisher','member']));

grant select on public.partner_contribution_commitments,
  public.partner_contribution_settlement_evidence,
  public.partner_contribution_evidence_reviews,
  public.partner_good_standing_reviews to authenticated;
revoke insert,update,delete on public.partner_contribution_commitments,
  public.partner_contribution_settlement_evidence,
  public.partner_contribution_evidence_reviews,
  public.partner_good_standing_reviews from authenticated;

create trigger partner_contribution_evidence_append_only
before update or delete on public.partner_contribution_settlement_evidence
for each row execute function private.block_all_mutation();
create trigger partner_contribution_evidence_reviews_append_only
before update or delete on public.partner_contribution_evidence_reviews
for each row execute function private.block_all_mutation();
create trigger partner_good_standing_reviews_append_only
before update or delete on public.partner_good_standing_reviews
for each row execute function private.block_all_mutation();

create or replace function private.guard_partner_participation_state()
returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if tg_op='INSERT' then
    if new.participation_state <> 'Basic Partner' and not private.is_platform_admin() then
      raise exception 'Partner participation state is server-derived' using errcode='42501';
    end if;
  elsif new.participation_state is distinct from old.participation_state and not private.is_platform_admin() then
    raise exception 'Partner participation state is server-derived' using errcode='42501';
  end if;
  return new;
end $$;
revoke all on function private.guard_partner_participation_state() from public,anon,authenticated;
drop trigger if exists organization_partner_profiles_participation_guard on public.organization_partner_profiles;
create trigger organization_partner_profiles_participation_guard
before insert or update on public.organization_partner_profiles
for each row execute function private.guard_partner_participation_state();

create or replace function private.partner_has_real_redemption(p_organization_id uuid)
returns boolean
language sql stable security definer set search_path='' as $$
  select exists(
    select 1
    from public.redemptions r
    join public.organizations o on o.id=r.partner_organization_id
    where r.partner_organization_id=p_organization_id
      and r.status='confirmed'
      and r.is_demo=false
      and o.is_demo=false
  )
$$;
revoke all on function private.partner_has_real_redemption(uuid) from public,anon,authenticated;

create or replace function private.partner_has_verified_settlement(p_organization_id uuid)
returns boolean
language sql stable security definer set search_path='' as $$
  with latest as (
    select distinct on (r.evidence_id) r.evidence_id,r.review_action
    from public.partner_contribution_evidence_reviews r
    order by r.evidence_id,r.created_at desc,r.id desc
  )
  select exists(
    select 1
    from public.partner_contribution_settlement_evidence e
    join latest l on l.evidence_id=e.id and l.review_action='verified'
    join public.organizations o on o.id=e.partner_organization_id
    where e.partner_organization_id=p_organization_id
      and e.is_demo=false
      and o.is_demo=false
  )
$$;
revoke all on function private.partner_has_verified_settlement(uuid) from public,anon,authenticated;

create or replace function private.partner_is_good_standing(p_organization_id uuid)
returns boolean
language sql stable security definer set search_path='' as $$
  select coalesce((
    select r.review_state='good_standing'
    from public.partner_good_standing_reviews r
    where r.partner_organization_id=p_organization_id
    order by r.created_at desc,r.id desc
    limit 1
  ),false)
$$;
revoke all on function private.partner_is_good_standing(uuid) from public,anon,authenticated;

create or replace function public.partner_participation_state(p_organization_id uuid)
returns text
language sql stable security definer set search_path='' as $$
  select case
    when private.partner_has_real_redemption(p_organization_id)
      and private.partner_has_verified_settlement(p_organization_id)
      and private.partner_is_good_standing(p_organization_id)
      then 'Shelter Impact Partner'
    when private.partner_has_real_redemption(p_organization_id)
      then 'Redemption Verified'
    when exists(
      select 1 from public.organization_partner_profiles p
      where p.organization_id=p_organization_id and p.publication_status='published'
    ) or exists(
      select 1 from public.offers o
      where o.organization_id=p_organization_id and o.status='active' and o.published_at is not null
    ) then 'Participating Partner'
    else 'Basic Partner'
  end
$$;
revoke all on function public.partner_participation_state(uuid) from public;
grant execute on function public.partner_participation_state(uuid) to anon,authenticated;

create or replace function public.create_partner_contribution_commitment(p_organization_id uuid,p_terms jsonb)
returns uuid
language plpgsql security definer set search_path='' as $$
declare
  commitment_id uuid:=gen_random_uuid();
  kind text;
  recipient_org uuid;
  amount bigint;
  pct integer;
  currency text;
  cadence_value text;
  org_demo boolean;
begin
  if not private.can_manage_org(p_organization_id,array['owner','administrator']) then raise exception 'Not authorized' using errcode='42501'; end if;
  if p_terms is null or jsonb_typeof(p_terms)<>'object' then raise exception 'Contribution commitment terms must be a JSON object'; end if;
  kind:=nullif(trim(p_terms->>'commitment_kind'),'');
  recipient_org:=nullif(p_terms->>'designated_recipient_organization_id','')::uuid;
  amount:=nullif(p_terms->>'amount_minor','')::bigint;
  pct:=nullif(p_terms->>'percentage_bps','')::integer;
  currency:=upper(coalesce(nullif(trim(p_terms->>'currency_code'),''),'USD'));
  cadence_value:=nullif(trim(p_terms->>'cadence'),'');
  if kind not in ('fixed_per_redemption','percent_of_paid_amount','recurring','one_time_campaign') then raise exception 'Unsupported contribution commitment kind'; end if;
  if currency !~ '^[A-Z]{3}$' then raise exception 'Currency code must be a three-letter ISO-style code'; end if;
  if recipient_org is not null and not exists(
    select 1 from public.organizations o where o.id=recipient_org and o.organization_type_code in ('shelter','rescue') and o.status='active'
  ) then raise exception 'Designated recipient must be an active shelter or rescue'; end if;
  if kind in ('fixed_per_redemption','recurring','one_time_campaign') and coalesce(amount,0)<=0 then raise exception 'Positive amount_minor is required for this commitment kind'; end if;
  if kind='percent_of_paid_amount' and (pct is null or pct<1 or pct>10000) then raise exception 'percentage_bps must be between 1 and 10000'; end if;
  if kind='recurring' and cadence_value not in ('monthly','quarterly','annual') then raise exception 'Recurring commitments require monthly, quarterly, or annual cadence'; end if;
  select o.is_demo into org_demo from public.organizations o where o.id=p_organization_id;
  insert into public.partner_contribution_commitments(
    id,partner_organization_id,commitment_kind,designated_recipient_organization_id,
    amount_minor,percentage_bps,currency_code,cadence,campaign_code,public_description,
    starts_at,ends_at,created_by,is_demo
  ) values(
    commitment_id,p_organization_id,kind,recipient_org,
    case when kind='percent_of_paid_amount' then null else amount end,
    case when kind='percent_of_paid_amount' then pct else null end,
    currency,case when kind='recurring' then cadence_value else null end,
    nullif(trim(p_terms->>'campaign_code'),''),nullif(trim(p_terms->>'public_description'),''),
    nullif(p_terms->>'starts_at','')::timestamptz,nullif(p_terms->>'ends_at','')::timestamptz,
    auth.uid(),coalesce(org_demo,false)
  );
  insert into private.audit_events(actor_id,action,target_type,target_id,outcome,context)
  values(auth.uid(),'partner_contribution_commitment.create','partner_contribution_commitment',commitment_id,'success',jsonb_build_object('partner_organization_id',p_organization_id,'commitment_kind',kind));
  return commitment_id;
end $$;

create or replace function public.set_partner_contribution_commitment_state(p_commitment_id uuid,p_state text,p_reason text default null)
returns text
language plpgsql security definer set search_path='' as $$
declare c public.partner_contribution_commitments;
begin
  select * into c from public.partner_contribution_commitments where id=p_commitment_id for update;
  if c.id is null or not private.can_manage_org(c.partner_organization_id,array['owner','administrator']) then raise exception 'Not authorized' using errcode='42501'; end if;
  if p_state not in ('active','paused','ended') then raise exception 'Unsupported contribution commitment state'; end if;
  update public.partner_contribution_commitments set status=p_state where id=c.id;
  insert into private.audit_events(actor_id,action,target_type,target_id,outcome,context)
  values(auth.uid(),'partner_contribution_commitment.'||p_state,'partner_contribution_commitment',c.id,'success',jsonb_build_object('reason',nullif(trim(p_reason),'')));
  return p_state;
end $$;

create or replace function public.submit_partner_contribution_evidence(p_organization_id uuid,p_evidence jsonb)
returns uuid
language plpgsql security definer set search_path='' as $$
declare
  evidence_id uuid:=gen_random_uuid();
  recipient_org uuid;
  commitment uuid;
  amount bigint;
  currency text;
  settlement_time timestamptz;
  evidence_ref text;
  metadata jsonb;
  org_demo boolean;
  recipient_demo boolean;
begin
  if not private.can_manage_org(p_organization_id,array['owner','administrator']) then raise exception 'Not authorized' using errcode='42501'; end if;
  if p_evidence is null or jsonb_typeof(p_evidence)<>'object' then raise exception 'Settlement evidence must be a JSON object'; end if;
  recipient_org:=nullif(p_evidence->>'recipient_organization_id','')::uuid;
  commitment:=nullif(p_evidence->>'commitment_id','')::uuid;
  amount:=nullif(p_evidence->>'amount_minor','')::bigint;
  currency:=upper(coalesce(nullif(trim(p_evidence->>'currency_code'),''),'USD'));
  settlement_time:=nullif(p_evidence->>'settled_at','')::timestamptz;
  evidence_ref:=nullif(trim(p_evidence->>'evidence_reference'),'');
  metadata:=coalesce(p_evidence->'evidence_metadata','{}'::jsonb);
  if recipient_org is null or not exists(
    select 1 from public.organizations o where o.id=recipient_org and o.organization_type_code in ('shelter','rescue') and o.status='active'
  ) then raise exception 'Settlement evidence requires an active shelter or rescue recipient'; end if;
  if commitment is not null and not exists(
    select 1 from public.partner_contribution_commitments c where c.id=commitment and c.partner_organization_id=p_organization_id
  ) then raise exception 'Commitment does not belong to this Partner'; end if;
  if coalesce(amount,0)<=0 then raise exception 'Positive amount_minor is required'; end if;
  if currency !~ '^[A-Z]{3}$' then raise exception 'Currency code must be a three-letter ISO-style code'; end if;
  if settlement_time is null or settlement_time>now() then raise exception 'settled_at must be a past or current timestamp'; end if;
  if evidence_ref is null then raise exception 'evidence_reference is required'; end if;
  if jsonb_typeof(metadata)<>'object' then raise exception 'evidence_metadata must be a JSON object'; end if;
  select is_demo into org_demo from public.organizations where id=p_organization_id;
  select is_demo into recipient_demo from public.organizations where id=recipient_org;
  insert into public.partner_contribution_settlement_evidence(
    id,partner_organization_id,commitment_id,recipient_organization_id,amount_minor,currency_code,
    settled_at,evidence_reference,evidence_metadata,submitted_by,is_demo
  ) values(
    evidence_id,p_organization_id,commitment,recipient_org,amount,currency,settlement_time,
    evidence_ref,metadata,auth.uid(),coalesce(org_demo,false) or coalesce(recipient_demo,false)
  );
  insert into private.audit_events(actor_id,action,target_type,target_id,outcome,context)
  values(auth.uid(),'partner_contribution_evidence.submit','partner_contribution_settlement_evidence',evidence_id,'success',jsonb_build_object('partner_organization_id',p_organization_id,'recipient_organization_id',recipient_org));
  return evidence_id;
end $$;

create or replace function public.review_partner_contribution_evidence(p_evidence_id uuid,p_action text,p_reason text)
returns bigint
language plpgsql security definer set search_path='' as $$
declare evidence public.partner_contribution_settlement_evidence; review_id bigint;
begin
  if not private.is_platform_admin() then raise exception 'Platform administrator required' using errcode='42501'; end if;
  if p_action not in ('verified','rejected','revoked') then raise exception 'Unsupported evidence review action'; end if;
  if coalesce(trim(p_reason),'')='' then raise exception 'Review reason is required'; end if;
  select * into evidence from public.partner_contribution_settlement_evidence where id=p_evidence_id;
  if evidence.id is null then raise exception 'Evidence not found'; end if;
  insert into public.partner_contribution_evidence_reviews(evidence_id,review_action,reason,reviewed_by)
  values(evidence.id,p_action,trim(p_reason),auth.uid()) returning id into review_id;
  insert into private.audit_events(actor_id,action,target_type,target_id,outcome,context)
  values(auth.uid(),'partner_contribution_evidence.review','partner_contribution_settlement_evidence',evidence.id,p_action,jsonb_build_object('review_id',review_id,'reason',trim(p_reason)));
  return review_id;
end $$;

create or replace function public.review_partner_good_standing(p_organization_id uuid,p_state text,p_reason text)
returns bigint
language plpgsql security definer set search_path='' as $$
declare review_id bigint;
begin
  if not private.is_platform_admin() then raise exception 'Platform administrator required' using errcode='42501'; end if;
  if p_state not in ('good_standing','not_good_standing') then raise exception 'Unsupported good-standing review state'; end if;
  if coalesce(trim(p_reason),'')='' then raise exception 'Review reason is required'; end if;
  if not exists(select 1 from public.organizations o where o.id=p_organization_id) then raise exception 'Partner organization not found'; end if;
  insert into public.partner_good_standing_reviews(partner_organization_id,review_state,reason,reviewed_by)
  values(p_organization_id,p_state,trim(p_reason),auth.uid()) returning id into review_id;
  insert into private.audit_events(actor_id,action,target_type,target_id,outcome,context)
  values(auth.uid(),'partner_good_standing.review','organization',p_organization_id,p_state,jsonb_build_object('review_id',review_id,'reason',trim(p_reason)));
  return review_id;
end $$;

create or replace function public.public_partner_impact_summary(p_organization_id uuid)
returns jsonb
language sql stable security definer set search_path='' as $$
  with verified_evidence as (
    select e.*
    from public.partner_contribution_settlement_evidence e
    join lateral (
      select r.review_action from public.partner_contribution_evidence_reviews r
      where r.evidence_id=e.id order by r.created_at desc,r.id desc limit 1
    ) latest on latest.review_action='verified'
    join public.organizations o on o.id=e.partner_organization_id
    where e.partner_organization_id=p_organization_id and e.is_demo=false and o.is_demo=false
  ), amounts as (
    select coalesce(jsonb_object_agg(currency_code,total_minor),'{}'::jsonb) value
    from (
      select currency_code::text currency_code,sum(amount_minor)::bigint total_minor
      from verified_evidence group by currency_code order by currency_code
    ) x
  )
  select jsonb_build_object(
    'participation_state',public.partner_participation_state(p_organization_id),
    'confirmed_redemptions',(
      select count(*) from public.redemptions r join public.organizations o on o.id=r.partner_organization_id
      where r.partner_organization_id=p_organization_id and r.status='confirmed' and r.is_demo=false and o.is_demo=false
    ),
    'verified_settlement_count',(select count(*) from verified_evidence),
    'verified_settlement_amounts',(select value from amounts)
  )
$$;
revoke all on function public.public_partner_impact_summary(uuid) from public;
grant execute on function public.public_partner_impact_summary(uuid) to anon,authenticated;

create or replace function public.partner_impact_summary(p_organization_id uuid)
returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
  if not (private.is_platform_admin() or private.can_manage_org(p_organization_id,array['owner','administrator','publisher','member'])) then raise exception 'Not authorized' using errcode='42501'; end if;
  select public.public_partner_impact_summary(p_organization_id) || jsonb_build_object(
    'active_commitments',(select count(*) from public.partner_contribution_commitments c where c.partner_organization_id=p_organization_id and c.status='active'),
    'accrued_intent_count',(select count(*) from public.donation_intents d where d.partner_organization_id=p_organization_id and d.status in ('accrued','ready') and d.is_demo=false),
    'accrued_intent_amounts',coalesce((
      select jsonb_object_agg(currency_code,total_minor) from (
        select currency_code::text currency_code,sum(amount_minor)::bigint total_minor
        from public.donation_intents d
        where d.partner_organization_id=p_organization_id and d.status in ('accrued','ready') and d.is_demo=false
        group by currency_code order by currency_code
      ) q
    ),'{}'::jsonb)
  ) into result;
  return result;
end $$;
revoke all on function public.partner_impact_summary(uuid) from public,anon;
grant execute on function public.partner_impact_summary(uuid) to authenticated;

create or replace function public.public_partner_directory(p_category text default null,p_state text default null,p_city text default null,p_mode text default null,p_species text default null)
returns table(organization_id uuid,business_name text,description text,city text,state text,business_model text,participation_state text)
language sql stable security definer set search_path='' as $$
  select o.id,o.public_name,p.public_description,l.city,l.state_province,p.business_model,public.partner_participation_state(o.id)
  from public.organization_partner_profiles p join public.organizations o on o.id=p.organization_id
  left join public.organization_locations l on l.organization_id=o.id and l.is_primary
  where p.publication_status='published'
    and (p_state is null or lower(l.state_province)=lower(p_state))
    and (p_city is null or lower(l.city)=lower(p_city))
    and (p_mode is null or p.business_model=p_mode)
    and (p_species is null or p_species=any(p.species_served))
    and (p_category is null or exists(
      select 1 from public.organization_categories oc join public.partner_categories c on c.id=oc.category_id
      where oc.organization_id=o.id and lower(c.label)=lower(p_category)
    ))
  order by o.public_name limit 100
$$;

create or replace function public.public_partner_profile_details(p_organization_id uuid)
returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object(
  'business_name',o.public_name,'description',p.public_description,'about',p.public_about,
  'website_url',o.website_url,'public_email',o.public_email,'public_phone',o.public_phone,
  'booking_url',p.public_booking_url,'order_url',p.public_order_url,'service_area',p.public_service_area,
  'business_model',p.business_model,'participation_state',public.partner_participation_state(o.id),
  'impact',public.public_partner_impact_summary(o.id),
  'social_links',coalesce((select jsonb_agg(jsonb_build_object('platform',s.platform,'url',s.url,'label',s.label)) from public.organization_social_links s where s.organization_id=o.id),'[]'::jsonb),
  'locations',coalesce((select jsonb_agg(jsonb_build_object('city',l.city,'state',l.state_province,'postal',l.postal_code)) from public.organization_locations l where l.organization_id=o.id),'[]'::jsonb),
  'hours',coalesce((select jsonb_agg(jsonb_build_object('day',h.day_of_week,'opens',h.opens_at,'closes',h.closes_at,'closed',h.is_closed)) from public.organization_business_hours h where h.organization_id=o.id),'[]'::jsonb)
 ) from public.organization_partner_profiles p join public.organizations o on o.id=p.organization_id
 where p.organization_id=p_organization_id and p.publication_status='published'
$$;

revoke all on function public.create_partner_contribution_commitment(uuid,jsonb),
  public.set_partner_contribution_commitment_state(uuid,text,text),
  public.submit_partner_contribution_evidence(uuid,jsonb),
  public.review_partner_contribution_evidence(uuid,text,text),
  public.review_partner_good_standing(uuid,text,text) from public,anon;
grant execute on function public.create_partner_contribution_commitment(uuid,jsonb),
  public.set_partner_contribution_commitment_state(uuid,text,text),
  public.submit_partner_contribution_evidence(uuid,jsonb),
  public.review_partner_contribution_evidence(uuid,text,text),
  public.review_partner_good_standing(uuid,text,text) to authenticated;
revoke all on function public.public_partner_directory(text,text,text,text,text),public.public_partner_profile_details(uuid) from public;
grant execute on function public.public_partner_directory(text,text,text,text,text),public.public_partner_profile_details(uuid) to anon,authenticated;
