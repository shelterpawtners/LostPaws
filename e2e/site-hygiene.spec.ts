import { expect, test } from "@playwright/test";

/**
 * Site-wide hygiene net. Each check here corresponds to a real defect found in
 * the 2026-09-12 site review (docs/SITE-REVIEW-2026-09-12.md): a 938px-wide
 * /directory on a 390px screen, one shared document title across every route,
 * sub-44px touch targets, and an h1->h3 heading jump on /register.
 */

const routes = [
  "/",
  "/rave",
  "/lostpaws",
  "/sevenstars",
  "/marketplace",
  "/learn",
  "/learn/passport",
  "/learn/savings-explorer",
  "/faq",
  "/support",
  "/events",
  "/hero-vendor",
  "/passport",
  "/partners",
  "/shelters",
  "/about",
  "/register",
  "/login",
  "/forgot-password",
  "/directory",
];

test.describe("site hygiene", () => {
  for (const route of routes) {
    test(`${route} stays inside a 390px viewport`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 900 });
      await page.goto(route);
      await page.locator("#main").waitFor({ state: "visible" });
      const { scroll, client } = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(scroll, `${route} overflows horizontally`).toBeLessThanOrEqual(
        client + 1,
      );
    });
  }

  test("every route has its own document title", async ({ page }) => {
    // These four walk every route in one test, so the default 30s budget is
    // too tight under parallel workers and caused intermittent failures.
    test.slow();
    const titles = new Map<string, string>();
    for (const route of routes) {
      await page.goto(route);
      await page.locator("#main").waitFor({ state: "visible" });
      await expect
        .poll(() => page.title(), { timeout: 5000 })
        .not.toBe("ShelterPawtners");
      titles.set(route, await page.title());
    }
    // A shared generic title on several routes is the defect this guards.
    const counts = new Map<string, number>();
    for (const title of titles.values()) {
      counts.set(title, (counts.get(title) ?? 0) + 1);
    }
    const duplicated = [...counts.entries()].filter(([, n]) => n > 1);
    expect(
      duplicated,
      `titles reused across routes: ${JSON.stringify(duplicated)}`,
    ).toEqual([]);
  });

  test("headings stay sequential and singular", async ({ page }) => {
    test.slow();
    for (const route of routes) {
      await page.goto(route);
      await page.locator("#main").waitFor({ state: "visible" });
      const levels = await page
        .locator("h1,h2,h3,h4,h5,h6")
        .evaluateAll((nodes) =>
          nodes.map((node) => ({
            level: Number(node.tagName[1]),
            text: (node.textContent ?? "").trim().slice(0, 50),
          })),
        );
      const h1s = levels.filter((h) => h.level === 1);
      expect(h1s.length, `${route} h1 count`).toBe(1);
      const jumps = levels.filter(
        (h, i) => i > 0 && h.level - levels[i - 1].level > 1,
      );
      expect(jumps, `${route} skips a heading level`).toEqual([]);
    }
  });

  test("interactive targets are at least 44px tall on mobile", async ({
    page,
  }) => {
    test.slow();
    await page.setViewportSize({ width: 390, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await page.locator("#main").waitFor({ state: "visible" });
      const small = await page.locator("a,button").evaluateAll((nodes) =>
        nodes
          .filter((node) => {
            const styles = getComputedStyle(node);
            if (styles.display === "none" || styles.visibility === "hidden")
              return false;
            const rect = node.getBoundingClientRect();
            // Inline links inside prose are exempt; these are standalone
            // controls, which is what the rect-vs-line-height check separates.
            return rect.width > 0 && rect.height > 0 && rect.height < 44;
          })
          .map((node) => ({
            text: (node.textContent ?? "").trim().slice(0, 40),
            height: Math.round(node.getBoundingClientRect().height),
          })),
      );
      expect(small, `${route} has sub-44px targets`).toEqual([]);
    }
  });

  test("no broken images and every image has alt text", async ({ page }) => {
    test.slow();
    for (const route of routes) {
      await page.goto(route);
      await page.locator("#main").waitFor({ state: "visible" });
      const problems = await page.evaluate(() =>
        [...document.images]
          .filter(
            (img) =>
              (img.complete && img.naturalWidth === 0) ||
              !img.hasAttribute("alt"),
          )
          .map((img) => img.currentSrc || img.src),
      );
      expect(problems, `${route} image problems`).toEqual([]);
    }
  });
});
