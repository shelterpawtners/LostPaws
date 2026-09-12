import { expect, test } from "@playwright/test";

const mobileWidths = [320, 360, 375, 390, 412, 430, 768];

test.describe("Issue #125 RAVE Shelter and LostPaws launch surfaces", () => {
  test("keeps RAVE Shelter and LostPaws intentionally distinct", async ({
    page,
  }) => {
    await page.goto("/rave");
    await expect(page.locator(".rsmPage")).toBeVisible();
    await expect(
      page.getByText("Rewarding Adoption with Vendor Exclusives", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.locator(".lpPage")).toHaveCount(0);

    await page.goto("/lostpaws");
    await expect(page.locator(".lpPage")).toBeVisible();
    await expect(
      page.getByText("A RAVE Shelter initiative for Lost Lands", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Bring the mission into the Lost Lands community.",
      }),
    ).toBeVisible();
    await expect(page.locator(".rsmPage")).toHaveCount(0);
  });

  for (const width of mobileWidths) {
    test(`keeps launch-critical campaign pages inside a ${width}px viewport`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: width < 500 ? 900 : 1024 });

      for (const route of ["/rave", "/lostpaws"]) {
        await page.goto(route);
        const sizes = await page.evaluate(() => ({
          client: document.documentElement.clientWidth,
          scroll: document.documentElement.scrollWidth,
        }));
        expect(sizes.scroll, `${route} @ ${width}px`).toBeLessThanOrEqual(
          sizes.client,
        );
      }
    });
  }

  test("preserves the full LostPaws hero artwork on mobile and keeps primary actions touchable", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto("/lostpaws");

    const hero = page.locator(".lpHeroMedia img");
    await expect(hero).toBeVisible();
    await expect(hero).toHaveCSS("object-fit", "contain");

    const actionHeights = await page
      .locator(".lpActions .lpButton")
      .evaluateAll((buttons) =>
        buttons.map((button) => button.getBoundingClientRect().height),
      );
    expect(actionHeights.every((height) => height >= 44)).toBe(true);
  });
});
