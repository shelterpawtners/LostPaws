import { describe, expect, it } from "vitest";
import { isRequestable, storeProducts } from "./catalog";

describe("Store catalog requestability", () => {
  it("gives every committed catalog product a stable database id", () => {
    const ids = storeProducts.map((product) => product.id);
    expect(new Set(ids)).toHaveLength(storeProducts.length);
    expect(ids).toHaveLength(8);
  });

  it("allows requests only for items truthfully marked in stock", () => {
    for (const product of storeProducts) {
      expect(isRequestable(product)).toBe(product.availability === "in_stock");
    }
  });
});
