import { describe, expect, it } from "vitest";
import {
  hasOrganizationMatchSignal,
  organizationMatchSummary,
} from "./organization-matching";

describe("entry-first organization matching", () => {
  it("does not start matching from a short, ambiguous name", () => {
    expect(hasOrganizationMatchSignal({ publicName: "AB" })).toBe(false);
  });
  it("starts matching from a meaningful business name", () => {
    expect(hasOrganizationMatchSignal({ publicName: "Paws & Co." })).toBe(true);
  });
  it("starts matching from a normalized phone signal", () => {
    expect(hasOrganizationMatchSignal({ phone: "(313) 555-0188" })).toBe(true);
  });
  it("keeps matching reasons explainable", () => {
    expect(organizationMatchSummary(["same website", "same city"])).toBe(
      "same website · same city",
    );
  });
});
