-- One launch-requestable Swag item. The stable UUID is used by the public
-- request RPC; mutable request context is captured as a snapshot at submit.
insert into public.store_products (
  id, slug, name, short_description, description, image_url, price_minor,
  currency, category, brand, availability, featured, status, sort_order
) values (
  '60000000-0000-0000-0000-000000000001',
  'shelterpawtners-logo-sticker',
  'Shelter Pawtners Logo Sticker',
  'A weatherproof die-cut sticker with the Shelter Pawtners mark.',
  'A durable, weatherproof vinyl sticker featuring the Shelter Pawtners logo.',
  'Store/Stickers/Shelter Pawtners Logo - black text.png',
  500, 'USD', 'stickers', 'ShelterPawtners', 'in_stock', true, 'active', 10
) on conflict (id) do update set
  image_url = excluded.image_url,
  price_minor = excluded.price_minor,
  status = excluded.status,
  updated_at = now();
