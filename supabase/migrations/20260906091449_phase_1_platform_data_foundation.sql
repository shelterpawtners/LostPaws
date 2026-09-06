-- Phase 1 additive platform and data foundation.
-- Existing profiles and prototype records are intentionally preserved.

create table public.role_definitions (
  code text primary key check (code ~ '^[a-z][a-z0-9_]*$'),
  label text not null,
  is_privileged boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.role_definitions (code, label, is_privileged) values
  ('guardian', 'Guardian', false),
  ('partner_member', 'Partner member', false),
  ('partner_admin', 'Partner administrator', true),
  ('shelter_member', 'Shelter member', false),
  ('shelter_admin', 'Shelter administrator', true),
  ('care_provider', 'Care provider', false),
  ('platform_admin', 'Platform administrator', true)
on conflict (code) do update set label = excluded.label, is_privileged = excluded.is_privileged;

create table public.user_roles (
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_code text not null references public.role_definitions(code),
  assigned_by uuid references public.profiles(id),
  assigned_at timestamptz not null default now(),
  revoked_at timestamptz,
  primary key (user_id, role_code, assigned_at)
);
create unique index user_roles_active_unique on public.user_roles(user_id, role_code) where revoked_at is null;
insert into public.user_roles(user_id, role_code, assigned_at)
select user_id,
  case participant_type::text
    when 'shelter' then 'shelter_member'
    when 'petbiz' then 'partner_member'
    when 'rave_vendor' then 'partner_member'
    when 'platform_admin' then 'platform_admin'
    else participant_type::text
  end,
  created_at
from public.participant_roles
where participant_type::text in ('guardian','shelter','petbiz','rave_vendor','platform_admin')
on conflict do nothing;

create table public.organization_types (
  code text primary key check (code ~ '^[a-z][a-z0-9_]*$'),
  label text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
insert into public.organization_types(code, label) values
  ('shelter','Shelter'), ('rescue','Rescue'), ('pet_business','Pet business'),
  ('veterinary_provider','Veterinary provider'), ('service_provider','Service provider'),
  ('community_partner','Community partner'), ('sponsor','Sponsor'),
  ('nonprofit_foundation','Nonprofit or foundation')
on conflict (code) do update set label = excluded.label;

alter table public.organizations add column if not exists organization_type_code text references public.organization_types(code);
alter table public.organizations add column if not exists parent_organization_id uuid references public.organizations(id);
alter table public.organizations add column if not exists is_demo boolean not null default false;
update public.organizations set organization_type_code = case organization_type::text
  when 'rave_vendor' then 'community_partner' else organization_type::text end
where organization_type_code is null;

create table public.organization_relationship_types (
  code text primary key check (code ~ '^[a-z][a-z0-9_]*$'),
  label text not null,
  is_directional boolean not null default true,
  is_active boolean not null default true
);
insert into public.organization_relationship_types(code,label,is_directional) values
  ('parent_child','Parent / child',true), ('affiliate','Affiliate',false),
  ('partner','Partner',false), ('fiscal_sponsor','Fiscal sponsor',true),
  ('sponsored_by','Sponsored by',true), ('preferred_vendor','Preferred vendor',true),
  ('managed_by','Managed by',true), ('community_partner','Community partner',false),
  ('funding_relationship','Funding relationship',true), ('other','Other',true)
on conflict (code) do update set label=excluded.label, is_directional=excluded.is_directional;

create table public.organization_relationships (
  id uuid primary key default gen_random_uuid(),
  source_organization_id uuid not null references public.organizations(id) on delete cascade,
  target_organization_id uuid not null references public.organizations(id) on delete cascade,
  relationship_type_code text not null references public.organization_relationship_types(code),
  status text not null default 'active' check (status in ('pending','active','inactive','declined')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  check (source_organization_id <> target_organization_id),
  check (ends_at is null or ends_at > starts_at)
);

alter table public.organization_memberships drop constraint if exists organization_memberships_role_check;
alter table public.organization_memberships add constraint organization_memberships_role_check check (role in ('owner','administrator','publisher','member')) not valid;

create table public.organization_locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  location_type text not null check (location_type in ('physical','online_only','service_area','regional','national')),
  name text,
  street_address_1 text,
  street_address_2 text,
  city text,
  state_province text,
  postal_code text,
  country_code char(2) not null default 'US',
  latitude numeric(9,6),
  longitude numeric(9,6),
  phone text,
  timezone text,
  is_primary boolean not null default false,
  is_demo boolean not null default false,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index organization_one_primary_location on public.organization_locations(organization_id) where is_primary;

create table public.partner_categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.partner_categories(id),
  code text not null unique check (code ~ '^[a-z][a-z0-9_]*$'),
  label text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);
create table public.organization_categories (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  category_id uuid not null references public.partner_categories(id),
  is_primary boolean not null default false,
  assigned_by uuid references public.profiles(id),
  assigned_at timestamptz not null default now(),
  primary key (organization_id, category_id)
);

insert into public.partner_categories(code,label,sort_order) values
  ('pet_services','Pet Services',10), ('health','Health',20), ('products','Products',30),
  ('insurance','Insurance',40), ('photography','Photography',50), ('transportation','Transportation',60),
  ('events','Events',70), ('community_business','Community Business',80), ('other','Other',90)
on conflict (code) do update set label=excluded.label, sort_order=excluded.sort_order;
insert into public.partner_categories(parent_id,code,label,sort_order)
select p.id, v.code, v.label, v.sort_order from public.partner_categories p cross join (values
 ('grooming','Grooming',11),('training','Training',12),('walking','Walking',13),('sitting','Sitting',14),
 ('boarding','Boarding',15),('daycare','Daycare',16)) v(code,label,sort_order) where p.code='pet_services'
on conflict (code) do update set label=excluded.label;
insert into public.partner_categories(parent_id,code,label,sort_order)
select p.id, v.code, v.label, v.sort_order from public.partner_categories p cross join (values
 ('veterinary','Veterinary',21),('pharmacy','Pharmacy',22),('rehabilitation','Rehabilitation',23),('wellness','Wellness',24)) v(code,label,sort_order) where p.code='health'
on conflict (code) do update set label=excluded.label;
insert into public.partner_categories(parent_id,code,label,sort_order)
select p.id, v.code, v.label, v.sort_order from public.partner_categories p cross join (values
 ('food','Food',31),('supplies','Supplies',32),('medication','Medication',33),('technology','Technology',34)) v(code,label,sort_order) where p.code='products'
on conflict (code) do update set label=excluded.label;

alter table public.pets add column if not exists birth_date date;
alter table public.pets add column if not exists altered_status text check (altered_status in ('unknown','unaltered','spayed','neutered'));
alter table public.pets add column if not exists weight_minor integer check (weight_minor is null or weight_minor >= 0);
alter table public.pets add column if not exists weight_unit text check (weight_unit in ('lb','kg'));
alter table public.pets add column if not exists primary_photo_path text;
alter table public.pets add column if not exists is_demo boolean not null default false;
alter table public.guardianships add column if not exists status text not null default 'active' check (status in ('pending','active','ended','disputed'));

create table public.provenance_types (
  code text primary key,
  label text not null,
  trust_rank smallint not null check (trust_rank between 0 and 100)
);
insert into public.provenance_types(code,label,trust_rank) values
 ('guardian_entered','Guardian entered',30),('shelter_entered','Shelter entered',50),
 ('shelter_verified','Shelter verified',80),('provider_entered','Provider entered',60),
 ('system_generated','System generated',40),('external_import','External import',45),
 ('platform_admin','Platform administrator',90)
on conflict(code) do update set label=excluded.label, trust_rank=excluded.trust_rank;

create table public.source_systems (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  source_type text not null check (source_type in ('api','csv','manual','other')),
  base_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
insert into public.source_systems(code,name,source_type) values
 ('petfinder','Petfinder','api'),('adopt_a_pet','Adopt-a-Pet','api'),('shelterluv','Shelterluv','api'),
 ('petpoint','PetPoint','api'),('petstablished','Petstablished','api'),('animals_first','Animals First','api'),
 ('csv','CSV','csv'),('manual','Manual entry','manual'),('other','Other','other')
on conflict(code) do update set name=excluded.name, source_type=excluded.source_type;

create table public.pet_identifiers (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  identifier_type text not null check (identifier_type in ('microchip','shelter_id','license','external_system_id','other')),
  identifier_value text not null,
  issuer_manufacturer text,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','pending','verified','rejected')),
  verified_at timestamptz,
  verified_by uuid references public.profiles(id),
  provenance_code text not null references public.provenance_types(code),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (identifier_type, identifier_value)
);
create table public.pet_external_identifiers (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  source_system_id uuid not null references public.source_systems(id),
  external_identifier text not null,
  source_url text,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique(source_system_id, external_identifier)
);
create table public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  source_system_id uuid references public.source_systems(id),
  source_reference text,
  import_type text not null,
  started_at timestamptz,
  completed_at timestamptz,
  status text not null default 'queued' check(status in ('queued','running','completed','completed_with_errors','failed','cancelled')),
  records_received integer not null default 0 check(records_received >= 0),
  records_created integer not null default 0 check(records_created >= 0),
  records_updated integer not null default 0 check(records_updated >= 0),
  records_rejected integer not null default 0 check(records_rejected >= 0),
  error_summary text,
  is_demo boolean not null default false,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.lifecycle_event_types (
  code text primary key,
  label text not null,
  shelter_animals_count_category text,
  is_live_outcome boolean,
  is_active boolean not null default true
);
insert into public.lifecycle_event_types(code,label,shelter_animals_count_category,is_live_outcome) values
 ('intake','Intake','intake',null),('stray_intake','Stray intake','stray_at_large',null),
 ('owner_relinquishment','Owner relinquishment','relinquished_by_owner',null),('seizure','Seizure','other_intakes',null),
 ('transfer_in','Transfer in','transfers_in',null),('transfer_out','Transfer out','transfers_out',true),
 ('adoption','Adoption','adoption',true),('return_to_owner','Return to owner','returned_to_owner',true),
 ('return_to_field','Return to field','returned_to_field',true),('other_live_outcome','Other live outcome','other_live_outcome',true),
 ('euthanasia','Euthanasia','euthanasia',false),('died_in_care','Died in care','died_in_care',false),
 ('lost_in_care','Lost in care','lost_in_care',false)
on conflict(code) do update set label=excluded.label, shelter_animals_count_category=excluded.shelter_animals_count_category;
create table public.pet_lifecycle_events (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  organization_id uuid references public.organizations(id),
  event_type_code text not null references public.lifecycle_event_types(code),
  event_at timestamptz not null,
  reason text,
  source_system_id uuid references public.source_systems(id),
  external_record_id text,
  entered_by uuid references public.profiles(id),
  provenance_code text not null references public.provenance_types(code),
  verification_status text not null default 'unverified' check(verification_status in ('unverified','pending','verified','rejected')),
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.offers add column if not exists is_demo boolean not null default false;
alter table public.offers add column if not exists current_version_id uuid;
create table public.offer_versions (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.offers(id) on delete cascade,
  version_number integer not null check(version_number > 0),
  title text not null,
  summary text not null,
  details text,
  terms text,
  starts_at timestamptz,
  ends_at timestamptz,
  availability_limit integer check(availability_limit is null or availability_limit > 0),
  status text not null default 'draft' check(status in ('draft','scheduled','published','paused','expired','hidden','archived')),
  published_at timestamptz,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  unique(offer_id, version_number),
  check(ends_at is null or starts_at is null or ends_at > starts_at)
);
alter table public.offers add constraint offers_current_version_fk foreign key(current_version_id) references public.offer_versions(id) not valid;
create table public.offer_eligibility_rules (
  id uuid primary key default gen_random_uuid(),
  offer_version_id uuid not null references public.offer_versions(id) on delete cascade,
  rule_type text not null,
  operator text not null default 'equals',
  rule_value jsonb not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create table public.offer_locations (
  id uuid primary key default gen_random_uuid(),
  offer_version_id uuid not null references public.offer_versions(id) on delete cascade,
  organization_location_id uuid references public.organization_locations(id),
  applicability text not null check(applicability in ('specific_location','all_organization_locations','online','national')),
  check((applicability='specific_location' and organization_location_id is not null) or (applicability<>'specific_location' and organization_location_id is null))
);
create unique index offer_locations_scope_unique on public.offer_locations(offer_version_id, applicability, coalesce(organization_location_id, '00000000-0000-0000-0000-000000000000'::uuid));
create table public.offer_claims (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.offers(id),
  offer_version_id uuid not null references public.offer_versions(id),
  guardian_id uuid not null references public.profiles(id),
  pet_id uuid references public.pets(id),
  status text not null default 'claimed' check(status in ('claimed','reserved','utilized','expired','cancelled','no_show')),
  claimed_at timestamptz not null default now(),
  expires_at timestamptz,
  is_demo boolean not null default false,
  unique(offer_version_id, guardian_id, pet_id)
);
create table public.redemptions (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid references public.offer_claims(id),
  offer_id uuid not null references public.offers(id),
  offer_version_id uuid not null references public.offer_versions(id),
  guardian_id uuid not null references public.profiles(id),
  pet_id uuid references public.pets(id),
  partner_organization_id uuid not null references public.organizations(id),
  organization_location_id uuid references public.organization_locations(id),
  campaign_code text,
  customer_type text check(customer_type in ('new','existing','unknown')),
  retail_amount_minor bigint check(retail_amount_minor is null or retail_amount_minor >= 0),
  paid_amount_minor bigint check(paid_amount_minor is null or paid_amount_minor >= 0),
  discount_amount_minor bigint check(discount_amount_minor is null or discount_amount_minor >= 0),
  tax_amount_minor bigint check(tax_amount_minor is null or tax_amount_minor >= 0),
  tip_amount_minor bigint check(tip_amount_minor is null or tip_amount_minor >= 0),
  fee_amount_minor bigint check(fee_amount_minor is null or fee_amount_minor >= 0),
  currency_code char(3) not null default 'USD',
  verification_method text,
  confirmed_by uuid references public.profiles(id),
  confirmed_at timestamptz,
  status text not null default 'pending' check(status in ('pending','confirmed','reversed','disputed')),
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table private.secure_tokens (
  id uuid primary key default gen_random_uuid(),
  purpose text not null check(purpose in ('pet_passport','guardian_redemption','partner_offer','shelter_transfer','adoption_verification')),
  token_digest text not null unique,
  target_type text not null,
  target_id uuid not null,
  expires_at timestamptz,
  used_at timestamptz,
  revoked_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.economic_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check(event_type in ('redemption','donation_intent','donation','refund','adjustment','reversal','replacement')),
  source_type text,
  source_id uuid,
  reverses_event_id uuid references public.economic_events(id),
  status text not null default 'draft' check(status in ('draft','finalized','reversed')),
  effective_at timestamptz not null default now(),
  finalized_at timestamptz,
  created_by uuid references public.profiles(id),
  is_demo boolean not null default false,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  check((status='finalized' and finalized_at is not null) or status<>'finalized')
);
create table public.economic_event_lines (
  id bigint generated always as identity primary key,
  economic_event_id uuid not null references public.economic_events(id),
  line_type text not null,
  account_reference text,
  amount_minor bigint not null,
  currency_code char(3) not null default 'USD',
  created_at timestamptz not null default now()
);

create table public.giving_providers (
  id uuid primary key default gen_random_uuid(),
  provider_type text not null check(provider_type in ('every_org','fiscal_sponsor','shelterpawtners_foundation','other')),
  name text not null,
  status text not null default 'planned' check(status in ('planned','active','inactive')),
  configuration_reference text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.donation_recipients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id),
  giving_provider_id uuid references public.giving_providers(id),
  provider_recipient_id text,
  eligibility_status text not null default 'pending' check(eligibility_status in ('pending','eligible','ineligible','suspended')),
  eligibility_verified_at timestamptz,
  eligibility_verified_by uuid references public.profiles(id),
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  unique(giving_provider_id, provider_recipient_id)
);
create table public.donation_intents (
  id uuid primary key default gen_random_uuid(),
  guardian_id uuid references public.profiles(id),
  partner_organization_id uuid references public.organizations(id),
  recipient_id uuid references public.donation_recipients(id),
  source_type text,
  source_id uuid,
  amount_minor bigint not null check(amount_minor > 0),
  currency_code char(3) not null default 'USD',
  status text not null default 'accrued' check(status in ('accrued','ready','cancelled','converted','expired')),
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check(guardian_id is not null or partner_organization_id is not null)
);
create table public.donation_transactions (
  id uuid primary key default gen_random_uuid(),
  giving_provider_id uuid not null references public.giving_providers(id),
  provider_transaction_id text,
  donor_user_id uuid references public.profiles(id),
  amount_minor bigint not null check(amount_minor > 0),
  currency_code char(3) not null default 'USD',
  transaction_at timestamptz,
  tax_year smallint,
  receipt_reference text,
  payment_method_category text,
  settlement_status text not null default 'pending' check(settlement_status in ('pending','settled','failed','refunded','partially_refunded')),
  refund_status text not null default 'none' check(refund_status in ('none','pending','partial','full')),
  goods_or_services_provided boolean not null default false,
  fair_market_value_minor bigint check(fair_market_value_minor is null or fair_market_value_minor >= 0),
  status text not null default 'pending' check(status in ('pending','finalized','reversed')),
  finalized_at timestamptz,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  unique(giving_provider_id, provider_transaction_id)
);
create table public.donation_allocations (
  id uuid primary key default gen_random_uuid(),
  donation_transaction_id uuid not null references public.donation_transactions(id),
  recipient_id uuid references public.donation_recipients(id),
  campaign_code text,
  allocation_type text not null check(allocation_type in ('recipient','shelter_fund','grant_program','campaign')),
  amount_minor bigint not null check(amount_minor > 0),
  currency_code char(3) not null default 'USD',
  created_at timestamptz not null default now()
);

create or replace function private.is_platform_admin() returns boolean
language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.user_roles where user_id=(select auth.uid()) and role_code='platform_admin' and revoked_at is null)
$$;
create or replace function private.can_manage_org(org uuid, allowed_roles text[] default array['owner','administrator']) returns boolean
language sql stable security definer set search_path='' as $$
  select private.is_platform_admin() or exists(select 1 from public.organization_memberships
    where organization_id=org and user_id=(select auth.uid()) and status='active' and role=any(allowed_roles))
$$;
revoke all on function private.is_platform_admin() from public;
revoke all on function private.can_manage_org(uuid,text[]) from public;
grant execute on function private.is_platform_admin() to authenticated;
grant execute on function private.can_manage_org(uuid,text[]) to authenticated;

create or replace function private.block_finalized_mutation() returns trigger
language plpgsql set search_path='' as $$
begin
  if old.status in ('finalized','reversed') then raise exception 'Finalized records are append-only'; end if;
  return case when tg_op='DELETE' then old else new end;
end $$;
create or replace function private.block_all_mutation() returns trigger
language plpgsql set search_path='' as $$ begin raise exception 'Record is append-only'; end $$;
create trigger economic_events_append_only before update or delete on public.economic_events for each row execute function private.block_finalized_mutation();
create trigger economic_lines_append_only before update or delete on public.economic_event_lines for each row execute function private.block_all_mutation();
create trigger donation_transactions_append_only before update or delete on public.donation_transactions for each row execute function private.block_finalized_mutation();
create trigger audit_events_append_only before update or delete on private.audit_events for each row execute function private.block_all_mutation();

do $$ declare t text; begin foreach t in array array[
 'role_definitions','user_roles','organization_types','organization_relationship_types','organization_relationships',
 'organization_locations','partner_categories','organization_categories','provenance_types','source_systems',
 'pet_identifiers','pet_external_identifiers','import_jobs','lifecycle_event_types','pet_lifecycle_events',
 'offer_versions','offer_eligibility_rules','offer_locations','offer_claims','redemptions','economic_events',
 'economic_event_lines','giving_providers','donation_recipients','donation_intents','donation_transactions','donation_allocations'
] loop execute format('alter table public.%I enable row level security',t); end loop; end $$;
alter table private.secure_tokens enable row level security;
alter table private.audit_events enable row level security;

create policy reference_roles_read on public.role_definitions for select to authenticated using(true);
create policy own_user_roles_read on public.user_roles for select to authenticated using(user_id=(select auth.uid()) or private.is_platform_admin());
create policy admin_user_roles_manage on public.user_roles for all to authenticated using(private.is_platform_admin()) with check(private.is_platform_admin());
create policy organization_types_read on public.organization_types for select to anon,authenticated using(is_active);
create policy relationship_types_read on public.organization_relationship_types for select to authenticated using(is_active);
create policy relationships_read on public.organization_relationships for select to authenticated using(private.can_manage_org(source_organization_id,array['owner','administrator','publisher','member']) or private.can_manage_org(target_organization_id,array['owner','administrator','publisher','member']));
create policy relationships_manage on public.organization_relationships for all to authenticated using(private.can_manage_org(source_organization_id)) with check(created_by=(select auth.uid()) and private.can_manage_org(source_organization_id));
create policy locations_public_read on public.organization_locations for select to anon,authenticated using(exists(select 1 from public.organizations o where o.id=organization_id and o.status='active') or private.can_manage_org(organization_id,array['owner','administrator','publisher','member']));
create policy locations_manage on public.organization_locations for all to authenticated using(private.can_manage_org(organization_id,array['owner','administrator','publisher'])) with check(created_by=(select auth.uid()) and private.can_manage_org(organization_id,array['owner','administrator','publisher']));
create policy categories_read on public.partner_categories for select to anon,authenticated using(is_active);
create policy org_categories_read on public.organization_categories for select to anon,authenticated using(exists(select 1 from public.organizations o where o.id=organization_id and o.status='active') or private.can_manage_org(organization_id,array['owner','administrator','publisher','member']));
create policy org_categories_manage on public.organization_categories for all to authenticated using(private.can_manage_org(organization_id,array['owner','administrator'])) with check(private.can_manage_org(organization_id,array['owner','administrator']));
create policy provenance_read on public.provenance_types for select to authenticated using(true);
create policy sources_read on public.source_systems for select to authenticated using(is_active);
create policy pet_identifiers_guardian_read on public.pet_identifiers for select to authenticated using(exists(select 1 from public.guardianships g where g.pet_id=pet_id and g.guardian_id=(select auth.uid()) and g.ended_at is null));
create policy pet_identifiers_guardian_add on public.pet_identifiers for insert to authenticated with check(created_by=(select auth.uid()) and exists(select 1 from public.guardianships g where g.pet_id=pet_id and g.guardian_id=(select auth.uid()) and g.ended_at is null));
create policy pet_external_guardian_read on public.pet_external_identifiers for select to authenticated using(exists(select 1 from public.guardianships g where g.pet_id=pet_id and g.guardian_id=(select auth.uid()) and g.ended_at is null));
create policy imports_org_read on public.import_jobs for select to authenticated using(private.can_manage_org(organization_id,array['owner','administrator','publisher','member']));
create policy imports_org_manage on public.import_jobs for all to authenticated using(private.can_manage_org(organization_id,array['owner','administrator'])) with check(created_by=(select auth.uid()) and private.can_manage_org(organization_id,array['owner','administrator']));
create policy lifecycle_types_read on public.lifecycle_event_types for select to authenticated using(is_active);
create policy lifecycle_guardian_read on public.pet_lifecycle_events for select to authenticated using(exists(select 1 from public.guardianships g where g.pet_id=pet_id and g.guardian_id=(select auth.uid()) and g.ended_at is null) or (organization_id is not null and private.can_manage_org(organization_id,array['owner','administrator','publisher','member'])));
create policy lifecycle_org_add on public.pet_lifecycle_events for insert to authenticated with check(entered_by=(select auth.uid()) and organization_id is not null and private.can_manage_org(organization_id,array['owner','administrator','publisher']));
create policy offer_versions_public_read on public.offer_versions for select to anon,authenticated using(status='published' or exists(select 1 from public.offers o where o.id=offer_id and private.can_manage_org(o.organization_id,array['owner','administrator','publisher','member'])));
create policy offer_versions_manage on public.offer_versions for all to authenticated using(exists(select 1 from public.offers o where o.id=offer_id and private.can_manage_org(o.organization_id,array['owner','administrator','publisher']))) with check(created_by=(select auth.uid()) and exists(select 1 from public.offers o where o.id=offer_id and private.can_manage_org(o.organization_id,array['owner','administrator','publisher'])));
create policy eligibility_public_read on public.offer_eligibility_rules for select to anon,authenticated using(exists(select 1 from public.offer_versions v where v.id=offer_version_id and v.status='published'));
create policy eligibility_org_manage on public.offer_eligibility_rules for all to authenticated using(exists(select 1 from public.offer_versions v join public.offers o on o.id=v.offer_id where v.id=offer_version_id and private.can_manage_org(o.organization_id,array['owner','administrator','publisher']))) with check(exists(select 1 from public.offer_versions v join public.offers o on o.id=v.offer_id where v.id=offer_version_id and private.can_manage_org(o.organization_id,array['owner','administrator','publisher'])));
create policy offer_locations_public_read on public.offer_locations for select to anon,authenticated using(exists(select 1 from public.offer_versions v where v.id=offer_version_id and v.status='published'));
create policy claims_guardian_read on public.offer_claims for select to authenticated using(guardian_id=(select auth.uid()) or exists(select 1 from public.offers o where o.id=offer_id and private.can_manage_org(o.organization_id,array['owner','administrator','publisher'])));
create policy claims_guardian_add on public.offer_claims for insert to authenticated with check(guardian_id=(select auth.uid()));
create policy claims_involved_update on public.offer_claims for update to authenticated using(guardian_id=(select auth.uid()) or exists(select 1 from public.offers o where o.id=offer_id and private.can_manage_org(o.organization_id,array['owner','administrator','publisher']))) with check(guardian_id=(select auth.uid()) or exists(select 1 from public.offers o where o.id=offer_id and private.can_manage_org(o.organization_id,array['owner','administrator','publisher'])));
create policy redemptions_involved_read on public.redemptions for select to authenticated using(guardian_id=(select auth.uid()) or private.can_manage_org(partner_organization_id,array['owner','administrator','publisher']));
create policy redemptions_partner_add on public.redemptions for insert to authenticated with check(private.can_manage_org(partner_organization_id,array['owner','administrator','publisher']));
create policy economic_admin_read on public.economic_events for select to authenticated using(private.is_platform_admin() or created_by=(select auth.uid()));
create policy economic_draft_add on public.economic_events for insert to authenticated with check(created_by=(select auth.uid()) and status='draft');
create policy economic_admin_update on public.economic_events for update to authenticated using(private.is_platform_admin()) with check(private.is_platform_admin());
create policy economic_lines_admin_read on public.economic_event_lines for select to authenticated using(private.is_platform_admin() or exists(select 1 from public.economic_events e where e.id=economic_event_id and e.created_by=(select auth.uid())));
create policy giving_providers_admin_read on public.giving_providers for select to authenticated using(private.is_platform_admin());
create policy recipients_admin_read on public.donation_recipients for select to authenticated using(private.is_platform_admin());
create policy donation_intents_own_read on public.donation_intents for select to authenticated using(guardian_id=(select auth.uid()) or (partner_organization_id is not null and private.can_manage_org(partner_organization_id,array['owner','administrator'])) or private.is_platform_admin());
create policy donation_intents_own_add on public.donation_intents for insert to authenticated with check((guardian_id=(select auth.uid()) or (partner_organization_id is not null and private.can_manage_org(partner_organization_id,array['owner','administrator']))) and status='accrued');
create policy donation_transactions_private_read on public.donation_transactions for select to authenticated using(donor_user_id=(select auth.uid()) or private.is_platform_admin());
create policy donation_allocations_private_read on public.donation_allocations for select to authenticated using(private.is_platform_admin() or exists(select 1 from public.donation_transactions d where d.id=donation_transaction_id and d.donor_user_id=(select auth.uid())));

grant select on public.role_definitions, public.organization_types, public.partner_categories to anon, authenticated;
grant select on public.organization_relationship_types, public.provenance_types, public.source_systems, public.lifecycle_event_types to authenticated;
grant select,insert,update,delete on public.user_roles,public.organization_relationships,public.organization_locations,public.organization_categories,public.pet_identifiers,public.pet_external_identifiers,public.import_jobs,public.pet_lifecycle_events,public.offer_versions,public.offer_eligibility_rules,public.offer_locations,public.offer_claims,public.redemptions,public.economic_events,public.economic_event_lines,public.giving_providers,public.donation_recipients,public.donation_intents,public.donation_transactions,public.donation_allocations to authenticated;
revoke all on private.secure_tokens, private.audit_events from public, anon, authenticated;

create index organization_parent_idx on public.organizations(parent_organization_id);
create index relationships_source_idx on public.organization_relationships(source_organization_id,status);
create index relationships_target_idx on public.organization_relationships(target_organization_id,status);
create index locations_org_idx on public.organization_locations(organization_id);
create index category_parent_idx on public.partner_categories(parent_id);
create index pet_identifiers_pet_idx on public.pet_identifiers(pet_id);
create index pet_external_pet_idx on public.pet_external_identifiers(pet_id);
create index import_jobs_org_idx on public.import_jobs(organization_id,created_at desc);
create index lifecycle_pet_time_idx on public.pet_lifecycle_events(pet_id,event_at desc);
create index lifecycle_org_time_idx on public.pet_lifecycle_events(organization_id,event_at desc);
create index offer_versions_offer_idx on public.offer_versions(offer_id,version_number desc);
create index offer_claims_guardian_idx on public.offer_claims(guardian_id,claimed_at desc);
create index redemptions_partner_idx on public.redemptions(partner_organization_id,created_at desc);
create index economic_source_idx on public.economic_events(source_type,source_id);
create index economic_lines_event_idx on public.economic_event_lines(economic_event_id);
create index donation_intents_guardian_idx on public.donation_intents(guardian_id,created_at desc);
create index donation_transactions_donor_idx on public.donation_transactions(donor_user_id,transaction_at desc);
create index donation_allocations_transaction_idx on public.donation_allocations(donation_transaction_id);
