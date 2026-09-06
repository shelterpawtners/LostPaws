const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  currencySign: "accounting",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoneyMinor(amountMinor: number, currencyCode = "USD") {
  if (!Number.isSafeInteger(amountMinor)) {
    throw new TypeError("Money must be supplied as integer minor units.");
  }
  if (currencyCode === "USD") return usd.format(amountMinor / 100);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    currencySign: "accounting",
  }).format(amountMinor / 100);
}
