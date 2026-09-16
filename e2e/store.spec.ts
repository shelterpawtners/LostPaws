import { expect, test } from "@playwright/test";

/**
 * Store is a first-party catalog. Public reads must remain usable without a
 * signed-in persona, whether the database-backed catalog has loaded or the
 * committed rollout fallback is in use.
 */
test.describe("Store", () => {
  test("lists first-party products with brand, price, and category filters", async ({
    page,
  }) => {
    await page.goto("/store");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Shelter Pawtners and LostPaws products/,
      }),
    ).toBeVisible();

    const sticker = page.locator(".stCard", {
      hasText: "Shelter Pawtners Logo Sticker",
    });
    await expect(sticker).toBeVisible();
    await expect(sticker).toContainText("$5.00");

    await page.getByRole("button", { name: "Apparel" }).click();
    await expect(sticker).toHaveCount(0);
    await expect(
      page.locator(".stCard", { hasText: "Shelter Pawtners Classic Tee" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "All products" }).click();
    await expect(sticker).toBeVisible();
  });

  test("makes every in-stock catalog item requestable without implying checkout", async ({
    page,
  }) => {
    await page.goto("/store");
    for (const name of [
      "Shelter Pawtners Logo Sticker",
      "LostPaws Sticker Pack",
      "RAVE Shelter Sticker",
      "Shelter Pawtners Classic Tee",
      "Shelter Pawtners Tote Bag",
      "LostPaws Enamel Pin",
    ]) {
      const product = page.locator(".stCard", { hasText: name });
      await expect(product.getByText("Request available")).toBeVisible();
      await expect(product.getByText("Available to request")).toBeVisible();
    }

    await expect(
      page.locator(".stCard", { hasText: "LostPaws Festival Tee" }),
    ).toContainText("Coming soon");
  });

  test("does not pretend checkout is live", async ({ page }) => {
    await page.goto("/store");
    await expect(page.getByText(/Checkout is not available yet/)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /add to cart|buy now|checkout/i }),
    ).toHaveCount(0);
  });

  test("product cards link to a stable product detail URL", async ({
    page,
  }) => {
    await page.goto("/store");
    await page
      .getByRole("link", { name: /Shelter Pawtners Logo Sticker/ })
      .click();
    await expect(page).toHaveURL(/\/store\/shelterpawtners-logo-sticker$/);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Shelter Pawtners Logo Sticker",
      }),
    ).toBeVisible();
    await expect(page.getByText(/Checkout is not available yet/)).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Request this item" }),
    ).toBeVisible();
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
  });

  test("an unknown product slug shows a truthful not-found state", async ({
    page,
  }) => {
    await page.goto("/store/does-not-exist");
    await expect(
      page.getByRole("heading", { level: 1, name: "Product not found" }),
    ).toBeVisible();
    await page.getByRole("link", { name: /Back to Store/ }).click();
    await expect(page).toHaveURL(/\/store$/);
  });

  test("Swag is reachable from primary navigation", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "Swag", exact: true })
      .click();
    await expect(page).toHaveURL(/\/store$/);
  });

  test("existing Marketplace behavior is unchanged", async ({ page }) => {
    await page.goto("/marketplace");
    await expect(page.locator("#main")).toBeVisible();
    await expect(page).toHaveURL(/\/marketplace$/);
  });
});
