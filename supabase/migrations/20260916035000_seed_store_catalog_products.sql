-- Stable public catalog backing for the existing first-party Swag products.
--
-- Product copy, prices, and availability mirror src/store/catalog.ts. Product
-- image URLs remain null where no owner-confirmed product image exists; do not
-- substitute a logo mark as a product photograph. `active` means the item is
-- a public catalog record. `availability` remains the requestability truth.

insert into public.store_products (
  id,
  slug,
  name,
  short_description,
  description,
  image_url,
  price_minor,
  currency,
  category,
  brand,
  availability,
  featured,
  promo_badge,
  status,
  sort_order
)
values
  (
    '60000000-0000-0000-0000-000000000001',
    'shelterpawtners-logo-sticker',
    'Shelter Pawtners Logo Sticker',
    'A weatherproof die-cut sticker with the Shelter Pawtners mark.',
    'A durable, weatherproof vinyl sticker featuring the Shelter Pawtners logo. Built for laptops, water bottles, and pet-gear cases.',
    'Store/Stickers/Shelter Pawtners Logo - black text.png',
    500,
    'USD',
    'stickers',
    'ShelterPawtners',
    'in_stock',
    true,
    null,
    'active',
    10
  ),
  (
    '60000000-0000-0000-0000-000000000002',
    'lostpaws-sticker-pack',
    'LostPaws Sticker Pack',
    'A three-sticker pack celebrating the LostPaws initiative.',
    'Three coordinated die-cut stickers featuring LostPaws artwork, sized for gear, cases, and pet carriers.',
    'Lost Paws Logos/LostPaws Logo/LostPaws Logo.png',
    600,
    'USD',
    'stickers',
    'LostPaws',
    'in_stock',
    false,
    null,
    'active',
    20
  ),
  (
    '60000000-0000-0000-0000-000000000003',
    'rave-shelter-sticker',
    'RAVE Shelter Sticker',
    'A single sticker for the RAVE Shelter community initiative.',
    'A vinyl sticker with the RAVE Shelter mark, made for festival gear, water bottles, and totes.',
    'brand/RAVE Shelter/rave-shelter-logo-mark.svg',
    400,
    'USD',
    'stickers',
    'RAVE Shelter',
    'in_stock',
    false,
    'New',
    'active',
    30
  ),
  (
    '60000000-0000-0000-0000-000000000004',
    'shelterpawtners-classic-tee',
    'Shelter Pawtners Classic Tee',
    'A soft, everyday cotton tee with the Shelter Pawtners logo.',
    'A classic-fit, soft cotton t-shirt with a front-chest Shelter Pawtners logo print. Available while Phase 2 sizing/fulfillment details are finalized.',
    null,
    2400,
    'USD',
    'apparel',
    'ShelterPawtners',
    'in_stock',
    true,
    null,
    'active',
    40
  ),
  (
    '60000000-0000-0000-0000-000000000005',
    'lostpaws-festival-tee',
    'LostPaws Festival Tee',
    'A festival-ready tee for the LostPaws community.',
    'A lightweight, breathable tee designed for festival wear, featuring LostPaws artwork on the front.',
    null,
    2800,
    'USD',
    'apparel',
    'LostPaws',
    'coming_soon',
    false,
    null,
    'active',
    50
  ),
  (
    '60000000-0000-0000-0000-000000000006',
    'rave-shelter-hoodie',
    'RAVE Shelter Hoodie',
    'A pullover hoodie for RAVE Shelter supporters.',
    'A midweight pullover hoodie with the RAVE Shelter mark, designed for cool festival nights and everyday wear.',
    null,
    4600,
    'USD',
    'merch',
    'RAVE Shelter',
    'coming_soon',
    false,
    'Launch collection',
    'active',
    60
  ),
  (
    '60000000-0000-0000-0000-000000000007',
    'shelterpawtners-tote-bag',
    'Shelter Pawtners Tote Bag',
    'A durable canvas tote for everyday errands.',
    'A sturdy canvas tote bag printed with the Shelter Pawtners logo, sized for groceries, pet supplies, or everyday carry.',
    null,
    1800,
    'USD',
    'merch',
    'ShelterPawtners',
    'in_stock',
    false,
    null,
    'active',
    70
  ),
  (
    '60000000-0000-0000-0000-000000000008',
    'lostpaws-enamel-pin',
    'LostPaws Enamel Pin',
    'A collectible hard-enamel pin with LostPaws artwork.',
    'A hard-enamel collectible pin featuring LostPaws artwork, with a secure double-post backing.',
    null,
    900,
    'USD',
    'merch',
    'LostPaws',
    'in_stock',
    false,
    null,
    'active',
    80
  )
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  short_description = excluded.short_description,
  description = excluded.description,
  image_url = excluded.image_url,
  price_minor = excluded.price_minor,
  currency = excluded.currency,
  category = excluded.category,
  brand = excluded.brand,
  availability = excluded.availability,
  featured = excluded.featured,
  promo_badge = excluded.promo_badge,
  status = excluded.status,
  sort_order = excluded.sort_order,
  updated_at = now();

-- The public form only renders for in-stock records. Preserve that boundary
-- inside the SECURITY DEFINER RPC as well, so callers cannot request a
-- coming-soon or sold-out product by bypassing the UI.
create or replace function public.create_store_request(
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
  select * into product
    from public.store_products
    where id = p_product_id
      and status = 'active'
      and availability = 'in_stock';
  if not found then
    raise exception 'This item is not available for requests.' using errcode='P0001';
  end if;
  insert into public.store_requests(product_id,product_slug_snapshot,unit_price_minor,currency,requester_name,requester_email,requester_phone,requested_size,quantity,notes,requester_id)
  values (product.id,product.slug,product.price_minor,product.currency,trim(p_requester_name),lower(trim(p_requester_email)),nullif(trim(p_requester_phone),''),nullif(trim(p_requested_size),''),p_quantity,nullif(trim(p_notes),''),auth.uid())
  returning * into result;
  return result;
end $$;

revoke all on function public.create_store_request(uuid,text,text,text,text,integer,text) from public;
grant execute on function public.create_store_request(uuid,text,text,text,text,integer,text) to anon, authenticated;
