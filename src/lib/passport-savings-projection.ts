/**
 * Illustrative Passport savings projections.
 *
 * Every figure produced here is derived only from inputs the visitor supplies.
 * Nothing in this module contains a researched or assumed spending average,
 * discount rate, or utilization rate, because none have been approved yet (see
 * docs/product/PASSPORT-SAVINGS-IMPACT-MODEL.md). Keep it that way: this is a
 * calculator, not a claim.
 *
 * Distinct from lib/savings.ts, which computes *realized* savings from an
 * actual redemption. Projected and realized figures must never be mixed.
 */

export type SavingsProjectionInputs = {
  /** What the visitor says they spend per month, in whole currency units. */
  monthlySpend: number;
  /** Average participating discount, 0..1. */
  discountRate: number;
  /** Share of that spend where a participating offer actually applies, 0..1. */
  utilization: number;
  /** Horizon for the long-term figure. */
  years: number;
};

export type SavingsProjection = {
  perMonth: number;
  firstYear: number;
  fullTerm: number;
  years: number;
};

export type SavingsScenarioBand = {
  low: SavingsProjection;
  base: SavingsProjection;
  high: SavingsProjection;
};

function clampRate(value: number) {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return value > 1 ? 1 : value;
}

function clampSpend(value: number) {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return value;
}

function clampYears(value: number) {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.floor(value);
}

export function projectSavings(
  inputs: SavingsProjectionInputs,
): SavingsProjection {
  const monthlySpend = clampSpend(inputs.monthlySpend);
  const discountRate = clampRate(inputs.discountRate);
  const utilization = clampRate(inputs.utilization);
  const years = clampYears(inputs.years);

  const perMonth = monthlySpend * utilization * discountRate;
  return {
    perMonth,
    firstYear: perMonth * 12,
    fullTerm: perMonth * 12 * years,
    years,
  };
}

/**
 * Low/base/high band around the visitor's own utilization estimate, so a
 * single guess is never presented as a precise outcome. The multipliers are
 * presentational uncertainty (halve it / take it as given / add half again),
 * not a claim about real-world behavior.
 */
export function projectSavingsBand(
  inputs: SavingsProjectionInputs,
): SavingsScenarioBand {
  const utilization = clampRate(inputs.utilization);
  return {
    low: projectSavings({ ...inputs, utilization: utilization * 0.5 }),
    base: projectSavings(inputs),
    high: projectSavings({ ...inputs, utilization: utilization * 1.5 }),
  };
}
