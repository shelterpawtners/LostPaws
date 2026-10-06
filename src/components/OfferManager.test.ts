import { describe, expect, it } from "vitest";
import { blankOffer } from "../lib/offers";
import {
  DEFAULT_OFFER_REDEMPTION_TEXT,
  DEFAULT_OFFER_TERMS_TEXT,
  offerStatusForVersionStatus,
  pendingOfferExtras,
  withPublishDefaults,
} from "./OfferManager";

describe("withPublishDefaults", () => {
  it("fills blank terms and redemption instructions for a pet offer", () => {
    const result = withPublishDefaults({ ...blankOffer, channel: "pet" });
    expect(result.terms).toBe(DEFAULT_OFFER_TERMS_TEXT);
    expect(result.redemption_instructions).toBe(DEFAULT_OFFER_REDEMPTION_TEXT);
  });

  it("leaves redemption instructions blank for a RAVE offer", () => {
    const result = withPublishDefaults({ ...blankOffer, channel: "rave" });
    expect(result.terms).toBe(DEFAULT_OFFER_TERMS_TEXT);
    expect(result.redemption_instructions).toBe("");
  });

  it("preserves text the vendor already entered", () => {
    const result = withPublishDefaults({
      ...blankOffer,
      channel: "pet",
      terms: "Custom terms.",
      redemption_instructions: "Custom redemption.",
    });
    expect(result.terms).toBe("Custom terms.");
    expect(result.redemption_instructions).toBe("Custom redemption.");
  });
});

describe("offerStatusForVersionStatus", () => {
  it("maps published and scheduled to active", () => {
    expect(offerStatusForVersionStatus("published")).toBe("active");
    expect(offerStatusForVersionStatus("scheduled")).toBe("active");
  });

  it("maps paused to suspended", () => {
    expect(offerStatusForVersionStatus("paused")).toBe("suspended");
  });

  it("maps anything else to expired", () => {
    expect(offerStatusForVersionStatus("archived")).toBe("expired");
    expect(offerStatusForVersionStatus("expired")).toBe("expired");
  });
});

describe("pendingOfferExtras", () => {
  it("lists every optional extra for a blank offer", () => {
    const items = pendingOfferExtras(blankOffer).map((item) => item.key);
    expect(items).toEqual(["photo", "link", "dates", "limits", "event"]);
  });

  it("drops items once their fields are filled in", () => {
    const items = pendingOfferExtras({
      ...blankOffer,
      image_path: "offers/photo.jpg",
      destination_url: "https://example.com/shop",
      starts_at: "2026-01-01T00:00",
      availability_limit: "10",
      event_id: "event-1",
    });
    expect(items).toEqual([]);
  });

  it("treats a product image URL as satisfying the photo item", () => {
    const items = pendingOfferExtras({
      ...blankOffer,
      image_urls_text: "https://example.com/photo.jpg",
    });
    expect(items.map((item) => item.key)).not.toContain("photo");
  });
});
