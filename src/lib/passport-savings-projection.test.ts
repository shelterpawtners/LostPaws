import { describe, expect, it } from "vitest";
import {
  projectSavings,
  projectSavingsBand,
} from "./passport-savings-projection";

const baseInputs = {
  monthlySpend: 100,
  discountRate: 0.1,
  utilization: 0.5,
  years: 15,
};

describe("passport savings projection", () => {
  it("derives every figure from the supplied inputs only", () => {
    const result = projectSavings(baseInputs);
    expect(result.perMonth).toBeCloseTo(5);
    expect(result.firstYear).toBeCloseTo(60);
    expect(result.fullTerm).toBeCloseTo(900);
    expect(result.years).toBe(15);
  });

  it("treats missing or nonsensical inputs as zero rather than guessing", () => {
    expect(projectSavings({ ...baseInputs, monthlySpend: 0 }).perMonth).toBe(0);
    expect(
      projectSavings({ ...baseInputs, monthlySpend: Number.NaN }).perMonth,
    ).toBe(0);
    expect(projectSavings({ ...baseInputs, discountRate: -1 }).perMonth).toBe(
      0,
    );
    expect(projectSavings({ ...baseInputs, years: 0 }).fullTerm).toBe(0);
  });

  it("clamps rates above 100% so a typo cannot inflate a projection", () => {
    const result = projectSavings({
      ...baseInputs,
      discountRate: 5,
      utilization: 3,
    });
    expect(result.perMonth).toBeCloseTo(100);
  });

  it("truncates fractional years to whole years", () => {
    expect(projectSavings({ ...baseInputs, years: 2.9 }).years).toBe(2);
  });

  it("brackets the visitor's own utilization estimate low/base/high", () => {
    const band = projectSavingsBand(baseInputs);
    expect(band.low.perMonth).toBeCloseTo(2.5);
    expect(band.base.perMonth).toBeCloseTo(5);
    expect(band.high.perMonth).toBeCloseTo(7.5);
  });

  it("keeps the high scenario from exceeding full utilization", () => {
    const band = projectSavingsBand({ ...baseInputs, utilization: 0.8 });
    expect(band.high.perMonth).toBeCloseTo(10);
  });
});
