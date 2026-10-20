import { expect, test, type Page } from "@playwright/test";

// Every public route shares the same Header; checking computed styles catches
// CSS import order/cascade regressions that screenshots alone can miss.
const routes = [
  "/",
  "/marketplace",
  "/lostpaws",
  "/rave",
  "/events",
  "/learn",
  "/register",
  "/login",
  "/directory",
  "/support",
  "/store",
  "/sevenstars",
] as const;

async function expectDarkShell(page: Page) {
  const header = page.locator("header.siteHeader");
  const nav = header.getByRole("navigation", { name: "Primary navigation" });
  await expect(header).toBeVisible();
  await expect(header).toHaveCSS("background-color", "rgb(11, 20, 38)");
  await expect(header).toHaveCSS("background-image", /linear-gradient/);
  await expect(nav.getByRole("link", { name: "Marketplace" })).toHaveCSS(
    "color", "rgb(245, 247, 255)",
  );
  await expect(nav.locator(".navGroup > summary")).toHaveCSS(
    "color", "rgb(245, 247, 255)",
  );
}

test.describe("shared site-header design contract", () => {
  test("desktop navigation remains dark and readable across core routes", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await expectDarkShell(page);
    }
  });

  test("mobile menu remains readable and operable across core routes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of routes) {
      await page.goto(route);
      const toggle = page.locator("header.siteHeader button.menu");
      await expect(toggle).toBeVisible();
      await toggle.focus();
      await page.keyboard.press("Enter");
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(toggle).toHaveAttribute("aria-label", "Close menu");
      const nav = page.getByRole("navigation", { name: "Primary navigation" });
      await expect(nav).toBeVisible();
      await expectDarkShell(page);
      await expect(nav).toHaveCSS("background-color", "rgb(16, 29, 52)");
      await page.keyboard.press("Enter");
      await expect(nav).toBeHidden();
    }
  });
});
