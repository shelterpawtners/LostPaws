/**
 * Phase 1 first-party Store catalog (Issue #152).
 *
 * A typed local config module rather than new database schema, so the
 * storefront can go live before commerce/payment requirements are settled.
 * This can migrate to Supabase or a commerce provider later without changing
 * page components substantially — every field here is what StorePage and
 * StoreProductDetail already render.
 */

const base = import.meta.env.BASE_URL;

export type StoreBrand = "ShelterPawtners" | "LostPaws" | "RAVE Shelter";

export type StoreCategory = "stickers" | "apparel" | "merch";

export type StoreAvailability = "in_stock" | "coming_soon" | "sold_out";

export type StoreProduct = {
  id?: string;
  slug: string;
  name: string;
  shortDescription: string;
  description?: string;
  imageUrl?: string;
  priceMinor: number;
  currency: string;
  category: StoreCategory;
  brand: StoreBrand;
  availability: StoreAvailability;
  featured?: boolean;
  promoBadge?: string;
  /**
   * Per-product/campaign shelter-support accounting, left unset until
   * business/accounting rules are finalized. When unset, pages fall back to
   * the generic non-numeric mission statement rather than inventing a
   * percentage (see AGENTS.md product invariants).
   */
  supportPercent?: number;
  supportStatement?: string;
};

export const storeCategories: { value: StoreCategory; label: string }[] = [
  { value: "stickers", label: "Stickers" },
  { value: "apparel", label: "Apparel" },
  { value: "merch", label: "Merch" },
];

export const storeAvailabilityLabels: Record<StoreAvailability, string> = {
  in_stock: "Ready when checkout opens",
  coming_soon: "Coming soon",
  sold_out: "Currently unavailable",
};

export const storeMissionStatement =
  "Shelter Pawtners intends for eligible first-party product sales to support shelters and rescues in Detroit and the surrounding Michigan communities. This is shelter support from product sales, not a tax-deductible customer donation, and no funds are represented as already given until accounting is finalized.";

export const storeProducts: StoreProduct[] = [
  {
    id: "60000000-0000-0000-0000-000000000001",
    slug: "shelterpawtners-logo-sticker",
    name: "Shelter Pawtners Logo Sticker",
    shortDescription:
      "A weatherproof die-cut sticker with the Shelter Pawtners mark.",
    description:
      "A durable, weatherproof vinyl sticker featuring the Shelter Pawtners logo. Built for laptops, water bottles, and pet-gear cases.",
    imageUrl: `${base}Store/Stickers/Shelter Pawtners Logo - black text.png`,
    priceMinor: 500,
    currency: "USD",
    category: "stickers",
    brand: "ShelterPawtners",
    availability: "in_stock",
    featured: true,
  },
  {
    slug: "lostpaws-sticker-pack",
    name: "LostPaws Sticker Pack",
    shortDescription:
      "A three-sticker pack celebrating the LostPaws initiative.",
    description:
      "Three coordinated die-cut stickers featuring LostPaws artwork, sized for gear, cases, and pet carriers.",
    imageUrl: `${base}Lost Paws Logos/LostPaws Logo/LostPaws Logo.png`,
    priceMinor: 600,
    currency: "USD",
    category: "stickers",
    brand: "LostPaws",
    availability: "in_stock",
  },
  {
    slug: "rave-shelter-sticker",
    name: "RAVE Shelter Sticker",
    shortDescription:
      "A single sticker for the RAVE Shelter community initiative.",
    description:
      "A vinyl sticker with the RAVE Shelter mark, made for festival gear, water bottles, and totes.",
    imageUrl: `${base}brand/RAVE Shelter/rave-shelter-logo-mark.svg`,
    priceMinor: 400,
    currency: "USD",
    category: "stickers",
    brand: "RAVE Shelter",
    availability: "in_stock",
    promoBadge: "New",
  },
  {
    slug: "shelterpawtners-classic-tee",
    name: "Shelter Pawtners Classic Tee",
    shortDescription:
      "A soft, everyday cotton tee with the Shelter Pawtners logo.",
    description:
      "A classic-fit, soft cotton t-shirt with a front-chest Shelter Pawtners logo print. Available while Phase 2 sizing/fulfillment details are finalized.",
    priceMinor: 2400,
    currency: "USD",
    category: "apparel",
    brand: "ShelterPawtners",
    availability: "in_stock",
    featured: true,
  },
  {
    slug: "lostpaws-festival-tee",
    name: "LostPaws Festival Tee",
    shortDescription: "A festival-ready tee for the LostPaws community.",
    description:
      "A lightweight, breathable tee designed for festival wear, featuring LostPaws artwork on the front.",
    priceMinor: 2800,
    currency: "USD",
    category: "apparel",
    brand: "LostPaws",
    availability: "coming_soon",
  },
  {
    slug: "rave-shelter-hoodie",
    name: "RAVE Shelter Hoodie",
    shortDescription: "A pullover hoodie for RAVE Shelter supporters.",
    description:
      "A midweight pullover hoodie with the RAVE Shelter mark, designed for cool festival nights and everyday wear.",
    priceMinor: 4600,
    currency: "USD",
    category: "merch",
    brand: "RAVE Shelter",
    availability: "coming_soon",
    promoBadge: "Launch collection",
  },
  {
    slug: "shelterpawtners-tote-bag",
    name: "Shelter Pawtners Tote Bag",
    shortDescription: "A durable canvas tote for everyday errands.",
    description:
      "A sturdy canvas tote bag printed with the Shelter Pawtners logo, sized for groceries, pet supplies, or everyday carry.",
    priceMinor: 1800,
    currency: "USD",
    category: "merch",
    brand: "ShelterPawtners",
    availability: "in_stock",
  },
  {
    slug: "lostpaws-enamel-pin",
    name: "LostPaws Enamel Pin",
    shortDescription: "A collectible hard-enamel pin with LostPaws artwork.",
    description:
      "A hard-enamel collectible pin featuring LostPaws artwork, with a secure double-post backing.",
    priceMinor: 900,
    currency: "USD",
    category: "merch",
    brand: "LostPaws",
    availability: "in_stock",
  },
];

export function formatStorePrice(
  product: Pick<StoreProduct, "priceMinor" | "currency">,
) {
  return (product.priceMinor / 100).toLocaleString(undefined, {
    style: "currency",
    currency: product.currency,
  });
}

export function findStoreProduct(slug: string | undefined) {
  if (!slug) return undefined;
  return storeProducts.find((product) => product.slug === slug);
}

export function storeProductsByCategory(category: StoreCategory | "all") {
  if (category === "all") return storeProducts;
  return storeProducts.filter((product) => product.category === category);
}
