import { describe, expect, it } from "vitest";
import { formatMoneyMinor } from "./currency";

describe("formatMoneyMinor", () => {
  it("uses US currency formatting from integer minor units", () => {
    expect(formatMoneyMinor(1642)).toBe("$16.42");
    expect(formatMoneyMinor(124600)).toBe("$1,246.00");
    expect(formatMoneyMinor(-2450)).toBe("($24.50)");
  });

  it("rejects fractional minor units", () => {
    expect(() => formatMoneyMinor(16.42)).toThrow(/integer minor units/);
  });
});
