-- Store/Swag admin catalog foundation (owner-approved, 2026-09-15 on #200).
--
-- src/store/catalog.ts is a typed static module -- deliberately not database
-- schema, per its own header comment, so the storefront could go live before
-- commerce requirements were settled. The owner has now approved a
-- database-backed, editable catalog so products can change without a code
-- deploy. This migration lays the foundation only: schema, RLS, and indexes.
-- It does not migrate StorePage/StoreProductDetail off the static catalog or
-- add an admin editing UI -- those are separate follow-up slices, sequenced
-- so this foundation can be reviewed independently first.
--
-- Modeled on the public.events / private.is_platform_admin() pattern already
-- used throughout the schema: platform-owned, not organization-owned (no
-- vendor manages the Store catalog), so writes are gated by
-- private.is_platform_admin() rather than private.can_manage_org.

create table public.store_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text not null,
  description text,
  image_url text,
  price_minor integer not null check (price_minor >= 0),
  currency text not null default 'USD',
  category text not null check (category in ('stickers', 'apparel', 'merch')),
  brand text not null check (brand in ('ShelterPawtners', 'LostPaws', 'RAVE Shelter')),
  availability text not null default 'coming_soon' check (availability in ('in_stock', 'coming_soon', 'sold_out')),
  featured boolean not null default false,
  promo_badge text,
  -- Left unset until business/accounting rules are finalized, same as the
  -- static catalog's supportPercent/supportStatement fields (see
  -- src/store/catalog.ts and AGENTS.md's "never fabricate ... donations").
  support_percent numeric,
  support_statement text,
  status public.record_status not null default 'draft',
  sort_order integer not null default 0,
  created_by uuid references public.profiles,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index store_products_status_idx on public.store_products (status, sort_order);
create index store_products_category_idx on public.store_products (category);

create trigger store_products_touch before update on public.store_products
  for each row execute function private.touch();

alter table public.store_products enable row level security;

-- Split by role for the same reason as events_public_read/events_read in
-- 20260912120000_track2_events_foundation.sql: private.is_platform_admin()
-- is granted to authenticated only, so a policy that calls it must never be
-- evaluated as anon.
create policy store_products_public_read on public.store_products for select to anon using (
  status = 'active'
);

create policy store_products_read on public.store_products for select to authenticated using (
  status = 'active' or private.is_platform_admin()
);

create policy store_products_admin_insert on public.store_products for insert to authenticated with check (
  private.is_platform_admin()
);

create policy store_products_admin_update on public.store_products for update to authenticated using (
  private.is_platform_admin()
) with check (
  private.is_platform_admin()
);

create policy store_products_admin_delete on public.store_products for delete to authenticated using (
  private.is_platform_admin()
);

grant select on public.store_products to anon;
grant select, insert, update, delete on public.store_products to authenticated;
