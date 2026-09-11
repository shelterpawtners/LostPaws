import { expect, test } from "@playwright/test";

test.describe("Phase 1 public accessibility and responsive regressions", () => {
  test("moves keyboard focus from the skip link to main content", async ({
    page,
  }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");
    await expect(page.locator(".skip")).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(page.locator("#main")).toBeFocused();
  });

  test("keeps the mobile menu labeled, touchable, and closable after navigation", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const menu = page.locator(".menu");
    await menu.click();
    await expect(menu).toHaveAttribute("aria-label", "Close menu");
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#primary-navigation")).toHaveAttribute(
      "aria-label",
      "Primary navigation",
    );

    const linkHeights = await page
      .locator("#primary-navigation a")
      .evaluateAll((links) =>
        links.map((link) => link.getBoundingClientRect().height),
      );
    expect(linkHeights.every((height) => height >= 44)).toBe(true);

    await page.getByRole("link", { name: "Marketplace" }).click();
    await expect(menu).toHaveAttribute("aria-label", "Open menu");
    await expect(menu).toHaveAttribute("aria-expanded", "false");
  });

  test("has no horizontal overflow at the narrow mobile width", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });

    for (const route of [
      "/",
      "/rave",
      "/lostpaws",
      "/marketplace",
      "/register?type=guardian",
    ]) {
      await page.goto(route);
      const widths = await page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(widths.scroll, route).toBeLessThanOrEqual(widths.client);
    }
  });

  test("uses the static approved RAVE mark on the unified mission page", async ({
    page,
  }) => {
    await page.goto("/rave");

    await expect(page.locator(".rsmLogoPanel img")).toHaveAttribute(
      "src",
      /rave-shelter-logo-static-v2\.png/,
    );
  });
});
