import { expect, test } from "@playwright/test";

const hosted = process.env.PLAYWRIGHT_HOSTED_QA === "true";

test.describe("Premium Marketplace experience", () => {
  test.skip(!hosted, "Set PLAYWRIGHT_HOSTED_QA=true for hosted Marketplace QA.");
  test.describe.configure({ timeout: 120_000 });

  test("value hierarchy, discovery, empty state, and public-benefit detail remain usable", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/marketplace");

    const marketplace = page.locator('[data-marketplace-concept="flagship"]');
    await expect(marketplace).toBeVisible();
    await expect(marketplace.locator(".marketplaceValuePanel")).toBeVisible();
    await expect(marketplace.locator(".offerCard").first()).toBeVisible();

    const hasPhoneOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(hasPhoneOverflow, "Marketplace must not overflow the phone viewport").toBe(false);

    const search = marketplace.getByLabel("Search current offers");
    await search.fill("no-listing-should-match-this-value");
    await expect(
      marketplace.getByRole("heading", {
        name: "No current offers match that search.",
      }),
    ).toBeVisible();

    await marketplace
      .getByRole("button", { name: "Clear search and filters" })
      .click();
    await expect(marketplace.locator(".offerCard").first()).toBeVisible();

    await marketplace
      .getByRole("button", { name: /Public Adoption Benefits/ })
      .click();
    await expect(
      marketplace.locator(".marketOfferCard-public_program").first(),
    ).toBeVisible();
    await expect(
      marketplace.locator(".marketOfferCard-partner_published"),
    ).toHaveCount(0);

    await search.fill("PetSmart");
    const petSmartCard = marketplace.locator(".offerCard", {
      hasText: "PetSmart Adoption Kit",
    });
    await expect(petSmartCard).toBeVisible();
    await expect(
      petSmartCard.getByText("Official third-party source"),
    ).toBeVisible();
    await expect(
      petSmartCard.getByText("Eligibility", { exact: true }),
    ).toBeVisible();

    await petSmartCard
      .getByRole("link", { name: "See benefit and eligibility" })
      .click();
    await expect(page).toHaveURL(/\/offers\//);
    await expect(
      page.getByRole("link", { name: "Visit official program" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Claim this offer" }),
    ).toHaveCount(0);

    for (const viewport of [
      { width: 768, height: 1024 },
      { width: 1440, height: 1000 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/marketplace");
      await expect(page.locator(".offerCard").first()).toBeVisible();
      const hasOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(hasOverflow, `Marketplace must not overflow at ${viewport.width}px`).toBe(false);
    }
  });
});
