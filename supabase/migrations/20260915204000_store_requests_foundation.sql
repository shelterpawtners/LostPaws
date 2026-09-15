-- Minimal public request intake for first-party Store/Swag items.
-- This intentionally does not create checkout, payment, fulfillment, tax, or
-- shipping behavior. Public users may submit a request; only platform admins
-- may read or update the queue.

create table public.store_requests (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.store_products(id) on delete restrict,
  product_slug_snapshot text not null,
  unit_price_minor integer not null check (unit_price_minor >= 0),
  currency text not null,
  variant_label text,
  requester_name text not null check (char_length(trim(requester_name)) between 1 and 160),
  requester_email text not null check (char_length(trim(requester_email)) between 3 and 320),
  requester_phone text,
  requested_size text,
  quantity integer not null default 1 check (quantity between 1 and 20),
  notes text,
  status text not null default 'new' check (status in ('new', 'contacted', 'fulfilled', 'closed')),
  requester_id uuid references public.profiles,
  contacted_at timestamptz,
  fulfilled_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index store_requests_product_created_idx on public.store_requests(product_id, created_at desc);
create index store_requests_status_created_idx on public.store_requests(status, created_at desc);
create trigger store_requests_touch before update on public.store_requests
  for each row execute function private.touch();

alter table public.store_requests enable row level security;

create policy store_requests_admin_read on public.store_requests for select to authenticated using (
  private.is_platform_admin()
);
create policy store_requests_admin_update on public.store_requests for update to authenticated using (
  private.is_platform_admin()
) with check (private.is_platform_admin());

grant select, update on public.store_requests to authenticated;

create function public.create_store_request(
  p_product_id uuid,
  p_requester_name text,
  p_requester_email text,
  p_requester_phone text default null,
  p_requested_size text default null,
  p_quantity integer default 1,
  p_notes text default null
) returns public.store_requests
language plpgsql security definer set search_path='' as $$
declare product public.store_products; result public.store_requests;
begin
  select * into product from public.store_products where id=p_product_id and status='active';
  if not found then raise exception 'This item is not available for requests.' using errcode='P0001'; end if;
  insert into public.store_requests(product_id,product_slug_snapshot,unit_price_minor,currency,requester_name,requester_email,requester_phone,requested_size,quantity,notes,requester_id)
  values (product.id,product.slug,product.price_minor,product.currency,trim(p_requester_name),lower(trim(p_requester_email)),nullif(trim(p_requester_phone),''),nullif(trim(p_requested_size),''),p_quantity,nullif(trim(p_notes),''),auth.uid())
  returning * into result;
  return result;
end $$;
revoke all on function public.create_store_request(uuid,text,text,text,text,integer,text) from public;
grant execute on function public.create_store_request(uuid,text,text,text,text,integer,text) to anon, authenticated;
