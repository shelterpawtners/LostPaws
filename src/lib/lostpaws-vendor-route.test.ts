import { describe, expect, it } from "vitest";
import { lostPawsVendorRoute } from "./lostpaws-vendor-route";

describe("LostPaws vendor acquisition route", () => {
  it("keeps signed-out prospects on RAVE registration", () => {
    expect(
      lostPawsVendorRoute({ signedIn: false, hasVendorOrganization: false }),
    ).toBe("/register?type=rave_vendor");
  });

  it("sends a signed-in user without a vendor organization to RAVE onboarding", () => {
    expect(
      lostPawsVendorRoute({ signedIn: true, hasVendorOrganization: false }),
    ).toBe("/onboarding/rave_vendor");
  });

  it("sends an existing vendor directly to RAVE offer management", () => {
    expect(
      lostPawsVendorRoute({ signedIn: true, hasVendorOrganization: true }),
    ).toBe("/partner/offers?channel=rave");
  });
});
