import { describe, expect, it } from "vitest";
import { candidateSavingsMinor } from "./savings";

describe("candidateSavingsMinor", () => {
  it("uses exact integer minor-unit subtraction", () => {
    expect(candidateSavingsMinor(2500n, 1800n)).toBe(700n);
  });

  it("floors candidate savings at zero instead of reporting negative savings", () => {
    expect(candidateSavingsMinor(1000n, 1200n)).toBe(0n);
  });

  it("returns null until both values are known", () => {
    expect(candidateSavingsMinor(null, 1200n)).toBeNull();
    expect(candidateSavingsMinor(1200n, null)).toBeNull();
  });

  it("rejects negative captured money values", () => {
    expect(() => candidateSavingsMinor(-1n, 0n)).toThrow(RangeError);
    expect(() => candidateSavingsMinor(0n, -1n)).toThrow(RangeError);
  });
});
