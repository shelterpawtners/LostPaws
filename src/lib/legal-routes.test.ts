import { describe, expect, it } from "vitest";
import {
  legalRoutes,
  legalRouteUrl,
  legalRoutesReadyForPublication,
} from "./legal-routes";

describe("legal route contract", () => {
  it("reserves stable public paths for Meta and production launch", () => {
    expect(legalRoutes).toEqual({
      privacy: "/privacy",
      terms: "/terms",
      dataDeletion: "/data-deletion",
    });
  });

  it("keeps publication gated until owner/legal approval", () => {
    expect(legalRoutesReadyForPublication).toBe(false);
  });

  it("builds final production URLs without changing route paths", () => {
    expect(
      legalRouteUrl("https://shelterpawtners.com", legalRoutes.privacy),
    ).toBe("https://shelterpawtners.com/privacy");
    expect(
      legalRouteUrl("https://shelterpawtners.com/", legalRoutes.dataDeletion),
    ).toBe("https://shelterpawtners.com/data-deletion");
  });
});
