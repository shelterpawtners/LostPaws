-- Phase 2 Checkpoint 2: Partner public profiles and directory foundation.
create table public.organization_partner_profiles (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  publication_status text not null default 'draft' check (publication_status in ('draft','published','unpublished','suspended','removed')),
  public_description text,
  public_about text,
  business_model text not null default 'physical' check (business_model in ('physical','online','mobile','service_area','national')),
  public_booking_url text,
  public_order_url text,
  public_service_area text,
  species_served text[] not null default '{}',
  participation_state text not null default 'Basic Partner' check (participation_state in ('Basic Partner','Participating Partner','Redemption Verified','Shelter Impact Partner')),
  publication_reason text,
  moderated_by uuid references public.profiles(id),
  moderated_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.organization_private_contacts (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  primary_contact_name text,
  primary_contact_email text,
  primary_contact_phone text,
  operational_contact_name text,
  operational_contact_email text,
  operational_contact_phone text,
  updated_at timestamptz not null default now()
);
create table public.organization_social_links (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  platform text not null check (platform in ('instagram','facebook','tiktok','youtube','linkedin','other')),
  url text not null check (url ~* '^https?://'),
  label text,
  primary key (organization_id, platform)
);
create table public.organization_business_hours (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  opens_at time,
  closes_at time,
  is_closed boolean not null default false,
  primary key (organization_id, day_of_week),
  check (is_closed or (opens_at is not null and closes_at is not null and opens_at < closes_at))
);
alter table public.organization_partner_profiles enable row level security;
alter table public.organization_private_contacts enable row level security;
alter table public.organization_social_links enable row level security;
alter table public.organization_business_hours enable row level security;
create policy profile_public_read on public.organization_partner_profiles for select to anon,authenticated using(publication_status='published');
create policy profile_manage on public.organization_partner_profiles for all to authenticated using(private.can_manage_org(organization_id,array['owner','administrator','publisher'])) with check(private.can_manage_org(organization_id,array['owner','administrator','publisher']) and publication_status in ('draft','published','unpublished'));
create policy profile_admin_manage on public.organization_partner_profiles for all to authenticated using(private.is_platform_admin()) with check(private.is_platform_admin());
create policy private_contacts_manage on public.organization_private_contacts for all to authenticated using(private.can_manage_org(organization_id,array['owner','administrator'])) with check(private.can_manage_org(organization_id,array['owner','administrator']));
create policy socials_public_read on public.organization_social_links for select to anon,authenticated using(exists(select 1 from public.organization_partner_profiles p where p.organization_id=organization_social_links.organization_id and p.publication_status='published'));
create policy socials_manage on public.organization_social_links for all to authenticated using(private.can_manage_org(organization_id,array['owner','administrator','publisher'])) with check(private.can_manage_org(organization_id,array['owner','administrator','publisher']));
create policy hours_public_read on public.organization_business_hours for select to anon,authenticated using(exists(select 1 from public.organization_partner_profiles p where p.organization_id=organization_business_hours.organization_id and p.publication_status='published'));
create policy hours_manage on public.organization_business_hours for all to authenticated using(private.can_manage_org(organization_id,array['owner','administrator','publisher'])) with check(private.can_manage_org(organization_id,array['owner','administrator','publisher']));
grant select,insert,update,delete on public.organization_partner_profiles,public.organization_private_contacts,public.organization_social_links,public.organization_business_hours to authenticated;
grant select on public.organization_partner_profiles,public.organization_social_links,public.organization_business_hours to anon;

create or replace function public.publish_partner_profile(p_organization_id uuid) returns void language plpgsql set search_path='' as $$
begin
 if not private.can_manage_org(p_organization_id,array['owner','administrator','publisher']) then raise exception 'Not authorized' using errcode='42501'; end if;
 if not exists(select 1 from public.organization_partner_profiles p join public.organizations o on o.id=p.organization_id where p.organization_id=p_organization_id and nullif(trim(o.public_name),'') is not null and nullif(trim(p.public_description),'') is not null and (nullif(trim(o.website_url),'') is not null or nullif(trim(o.public_email),'') is not null or nullif(trim(o.public_phone),'') is not null or nullif(trim(p.public_booking_url),'') is not null or nullif(trim(p.public_order_url),'') is not null or exists(select 1 from public.organization_social_links s where s.organization_id=p_organization_id)) and (p.business_model in ('online','national','mobile','service_area') or exists(select 1 from public.organization_locations l where l.organization_id=p_organization_id and (nullif(trim(l.city),'') is not null or nullif(trim(l.state_province),'') is not null)))) then raise exception 'Complete the public description, a contact path, and a location or service area before publishing' using errcode='23514'; end if;
 update public.organization_partner_profiles set publication_status='published',published_at=coalesce(published_at,now()),publication_reason=null,updated_at=now() where organization_id=p_organization_id;
end $$;
revoke all on function public.publish_partner_profile(uuid) from public,anon; grant execute on function public.publish_partner_profile(uuid) to authenticated;

create or replace function public.public_partner_directory(p_category text default null,p_state text default null,p_city text default null,p_mode text default null,p_species text default null) returns table(organization_id uuid, business_name text, description text, city text, state text, business_model text, participation_state text) language sql stable security definer set search_path='' as $$ select o.id,o.public_name,p.public_description,l.city,l.state_province,p.business_model,p.participation_state from public.organization_partner_profiles p join public.organizations o on o.id=p.organization_id left join public.organization_locations l on l.organization_id=o.id and l.is_primary where p.publication_status='published' and (p_state is null or lower(l.state_province)=lower(p_state)) and (p_city is null or lower(l.city)=lower(p_city)) and (p_mode is null or p.business_model=p_mode) and (p_species is null or p_species=any(p.species_served)) and (p_category is null or exists(select 1 from public.organization_categories oc join public.partner_categories c on c.id=oc.category_id where oc.organization_id=o.id and lower(c.label)=lower(p_category))) order by o.public_name limit 100 $$;
revoke all on function public.public_partner_directory(text,text,text,text,text) from public; grant execute on function public.public_partner_directory(text,text,text,text,text) to anon,authenticated;
