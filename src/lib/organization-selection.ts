/**
 * Shared, deterministic "which organization should be selected by default"
 * logic for every page that manages a vendor's own organization(s)
 * (PartnerProfileEditor, OfferManager). A user with more than one
 * organization must see the same one selected everywhere and across
 * reloads -- otherwise editing a profile on one page and offers on another
 * can silently operate on two different organizations. Postgres does not
 * guarantee row order without an ORDER BY, so relying on API response order
 * for the default choice is what caused that inconsistency.
 */
export function selectedOrgStorageKey(userId: string) {
  return `sp:selected-org:${userId}`;
}

export function resolveDefaultOrgId<T extends { id: string }>(
  orgs: T[],
  userId: string,
): string {
  const sorted = [...orgs].sort((a, b) => a.id.localeCompare(b.id));
  const stored = localStorage.getItem(selectedOrgStorageKey(userId));
  if (stored && sorted.some((org) => org.id === stored)) return stored;
  return sorted[0]?.id || "";
}
