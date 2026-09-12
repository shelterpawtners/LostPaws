/**
 * Per-route document titles.
 *
 * The app is a single-page app with one static <title> in index.html, so every
 * route reported the same "ShelterPawtners" title in the browser tab, in
 * bookmarks, and to anything that reads a title when a link is shared.
 */

const SUFFIX = "ShelterPawtners";

const exactTitles: Record<string, string> = {
  "/": "ShelterPawtners — Care, savings, and community for shelter pets",
  "/rave": "RAVE Shelter — Rave with purpose. Shop with impact.",
  "/lostpaws": "LostPaws — a RAVE Shelter initiative for Lost Lands",
  "/marketplace": "Marketplace",
  "/learn": "Learn how it works",
  "/learn/savings-explorer": "Savings explorer",
  "/faq": "Frequently asked questions",
  "/hero-vendor": "RAVE Shelter Hero Vendor program",
  "/passport": "Digital Pet Passport",
  "/partners": "PetBiz and community partners",
  "/shelters": "For shelters and rescues",
  "/about": "About ShelterPawtners",
  "/register": "Create your account",
  "/login": "Sign in",
  "/forgot-password": "Reset your password",
  "/reset-password": "Choose a new password",
  "/directory": "Partner directory",
  "/dashboard": "My dashboard",
};

export function titleForPath(pathname: string, learnTitle?: string): string {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  const exact = exactTitles[path];
  if (exact) return exact.includes(SUFFIX) ? exact : `${exact} | ${SUFFIX}`;

  if (learnTitle) return `${learnTitle} | ${SUFFIX}`;

  if (path.startsWith("/offers/")) return `Offer details | ${SUFFIX}`;
  if (path.startsWith("/partners/")) return `Partner profile | ${SUFFIX}`;
  if (path.startsWith("/learn/")) return `Learn | ${SUFFIX}`;

  return SUFFIX;
}
