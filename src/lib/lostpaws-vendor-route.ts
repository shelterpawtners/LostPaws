export type LostPawsVendorRoute =
  | "/register?type=rave_vendor"
  | "/onboarding/rave_vendor"
  | "/partner/offers?channel=rave";

export function lostPawsVendorRoute({
  signedIn,
  hasVendorOrganization,
}: {
  signedIn: boolean;
  hasVendorOrganization: boolean;
}): LostPawsVendorRoute {
  if (!signedIn) return "/register?type=rave_vendor";
  return hasVendorOrganization
    ? "/partner/offers?channel=rave"
    : "/onboarding/rave_vendor";
}
