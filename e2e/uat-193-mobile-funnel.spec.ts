import { expect, test } from "@playwright/test";

const widths = [375, 390, 414, 768];
const routes = [
  "/lostpaws",
  "/login",
  "/register?type=guardian",
  "/register?type=shelter",
  "/register?type=petbiz",
  "/register?type=rave_vendor",
];

test.describe("UAT-193 mobile Guardian and Vendor funnel", () => {
  for (const width of widths) {
    test(`keeps funnel routes inside a ${width}px viewport`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width,
        height: width < 768 ? 900 : 1024,
      });

      for (const route of routes) {
        await page.goto(route);
        await page.locator("#main").waitFor({ state: "visible" });
        const { client, scroll } = await page.evaluate(() => ({
          client: document.documentElement.clientWidth,
          scroll: document.documentElement.scrollWidth,
        }));
        expect(scroll, `${route} @ ${width}px`).toBeLessThanOrEqual(client + 1);
      }
    });
  }

  test("keeps primary funnel actions touchable on a phone", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 900 });

    for (const route of routes) {
      await page.goto(route);
      await page.locator("#main").waitFor({ state: "visible" });
      const undersized = await page.locator("button, a").evaluateAll((nodes) =>
        nodes
          .filter((node) => {
            const style = getComputedStyle(node);
            const rect = node.getBoundingClientRect();
            return (
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              rect.width > 0 &&
              rect.height > 0 &&
              rect.height < 44
            );
          })
          .map((node) => ({
            text: (node.textContent ?? "").trim().slice(0, 60),
            height: Math.round(node.getBoundingClientRect().height),
          })),
      );
      expect(undersized, `${route} has sub-44px funnel controls`).toEqual([]);
    }
  });
});
