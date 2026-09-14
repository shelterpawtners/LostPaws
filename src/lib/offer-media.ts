/**
 * Issue #155: vendor-supplied commerce links/images must be HTTPS only, with
 * no script/javascript: injection — enforced again here as the client-side
 * half of the same check the create_partner_offer/revise_partner_offer RPCs
 * make server-side (see the issue #155 migration for why: Etsy blocks
 * scraping/automated fetches, so this ships a safe deep-link + rich media
 * path rather than an iframe/API embed).
 */
export function isSafeHttpsUrl(value: string): boolean {
  if (!value.trim()) return true; // empty is allowed; the field is optional
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function hostOf(value: string): string {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** A sensible default CTA label when the vendor has not set cta_label. */
export function ctaLabelFor(destinationUrl: string | null): string {
  const host = destinationUrl ? hostOf(destinationUrl) : "";
  if (host.endsWith("etsy.com")) return "Shop on Etsy";
  if (host) return "Visit vendor store";
  return "View item";
}
