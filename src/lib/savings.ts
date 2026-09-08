export function candidateSavingsMinor(
  referenceAmountMinor: bigint | null,
  paidAmountMinor: bigint | null,
): bigint | null {
  if (referenceAmountMinor === null || paidAmountMinor === null) return null;
  if (referenceAmountMinor < 0n || paidAmountMinor < 0n) {
    throw new RangeError("Money amounts cannot be negative");
  }

  const difference = referenceAmountMinor - paidAmountMinor;
  return difference > 0n ? difference : 0n;
}
