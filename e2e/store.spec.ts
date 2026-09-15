import { expect, test } from "@playwright/test";

/**
 * Store (Issue #152) is a first-party static catalog with no database
 * dependency, so this belongs with the credential-free public suite rather
 * than Persona QA.
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
    await expect(sticker).toContainText("$4.00");

    await page.getByRole("button", { name: "Apparel" }).click();
    await expect(sticker).toHaveCount(0);
    await expect(
      page.locator(".stCard", { hasText: "Shelter Pawtners Classic Tee" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "All products" }).click();
    await expect(sticker).toBeVisible();
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
