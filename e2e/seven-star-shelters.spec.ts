import { expect, test } from "@playwright/test";

test.describe("Seven Star Shelters", () => {
  test("is an independent, actionable RAVE Shelter activation", async ({
    page,
  }) => {
    await page.goto("/sevenstars");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Show love. Spread shelter love.",
      }),
    ).toBeVisible();
    await expect(
      page.getByText(/Independent community activation by RAVE Shelter/),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Browse RAVE offers" }),
    ).toHaveAttribute("href", "/marketplace?channel=rave");
    await expect(
      page.getByRole("link", { name: "Become a vendor" }).first(),
    ).toHaveAttribute("href", "/register?type=rave_vendor");
    await expect(
      page.getByRole("link", { name: /Read the official Seven Pillars/ }),
    ).toHaveAttribute("href", "https://www.sevenstarsfest.com/seven-pillars");
  });

  test("stays usable on a small screen", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/sevenstars");
    await page.locator("#main").waitFor({ state: "visible" });
    const width = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(width.scroll).toBeLessThanOrEqual(width.client + 1);
    await expect(
      page.getByRole("link", { name: "Join the movement" }),
    ).toBeVisible();
  });
});
