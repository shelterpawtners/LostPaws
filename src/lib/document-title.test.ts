import { describe, expect, it } from "vitest";
import { titleForPath } from "./document-title";

describe("per-route document titles", () => {
  it("gives each key public route its own title", () => {
    expect(titleForPath("/")).toMatch(/^ShelterPawtners —/);
    expect(titleForPath("/rave")).toContain("RAVE Shelter");
    expect(titleForPath("/lostpaws")).toContain("LostPaws");
    expect(titleForPath("/sevenstars")).toContain("Seven Star Shelters");
    expect(titleForPath("/faq")).toBe(
      "Frequently asked questions | ShelterPawtners",
    );
  });

  it("does not repeat the brand when the title already carries it", () => {
    expect(titleForPath("/")).not.toMatch(/ShelterPawtners.*ShelterPawtners/);
  });

  it("uses a supplied learn article title for article routes", () => {
    expect(titleForPath("/learn/passport", "The Passport")).toBe(
      "The Passport | ShelterPawtners",
    );
  });

  it("tolerates a trailing slash", () => {
    expect(titleForPath("/faq/")).toBe(
      "Frequently asked questions | ShelterPawtners",
    );
  });

  it("falls back to the brand alone for unmapped routes", () => {
    expect(titleForPath("/some/unmapped/route")).toBe("ShelterPawtners");
  });

  it("labels dynamic detail routes generically", () => {
    expect(titleForPath("/offers/abc-123")).toBe(
      "Offer details | ShelterPawtners",
    );
  });
});
