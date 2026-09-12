import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/learn",
  "/learn/passport",
  "/learn/vendors",
  "/learn/savings-explorer",
  "/faq",
  "/hero-vendor",
];

test.describe("Track 3 Learn, FAQ, Hero Vendor, and savings explorer", () => {
  test("learn hub lists topics and reaches an article", async ({ page }) => {
    await page.goto("/learn");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Understand how this works/,
      }),
    ).toBeVisible();

    await page
      .getByRole("link", { name: /The Certified Shelter Pet Passport/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/learn\/passport$/);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "The Certified Shelter Pet Passport",
      }),
    ).toBeVisible();
  });

  test("an unknown learn topic falls back to the hub instead of a dead end", async ({
    page,
  }) => {
    await page.goto("/learn/not-a-real-topic");
    await expect(page).toHaveURL(/\/learn$/);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Understand how this works/,
      }),
    ).toBeVisible();
  });

  test("faq filters by audience", async ({ page }) => {
    await page.goto("/faq");
    const guardianQuestion = page.getByText(
      "Does a Guardian account cost anything?",
    );
    const vendorQuestion = page.getByText(
      "What does it cost a business to join?",
    );
    await expect(guardianQuestion).toBeVisible();
    await expect(vendorQuestion).toBeVisible();

    await page.getByRole("button", { name: "Guardians", exact: true }).click();
    await expect(guardianQuestion).toBeVisible();
    await expect(vendorQuestion).toHaveCount(0);
  });

  test("faq refuses to state a savings average", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.getByText("How much will I save?")).toBeVisible();
    await expect(
      page.getByText(/We do not publish a savings average/),
    ).toBeVisible();
  });

  // Guards the guardrail in docs/product/PASSPORT-SAVINGS-IMPACT-MODEL.md: no
  // savings figure may be shown until the visitor supplies the assumptions.
  test("savings explorer shows nothing until the visitor supplies figures", async ({
    page,
  }) => {
    await page.goto("/learn/savings-explorer");
    await expect(
      page.getByText(/Fill in the three fields on the left/),
    ).toBeVisible();
    await expect(page.locator(".learnCalcTable")).toHaveCount(0);

    await page
      .getByLabel("What do you spend on your pet each month?")
      .fill("100");
    await page.getByLabel("Average discount you expect to get (%)").fill("10");
    await page
      .getByLabel("Share of that spending where an offer applies (%)")
      .fill("50");

    await expect(page.locator(".learnCalcTable")).toBeVisible();
    // 100 * 50% * 10% = 5/month, 60/year, 900 over the default 15 years.
    await expect(page.locator(".learnCalcBase")).toContainText("$5");
    await expect(page.locator(".learnCalcBase")).toContainText("$60");
    await expect(page.locator(".learnCalcBase")).toContainText("$900");
    await expect(
      page.getByText(/not a prediction, an offer, or a record of money saved/),
    ).toBeVisible();
  });

  test("hero vendor page states the 5% threshold and what is unsettled", async ({
    page,
  }) => {
    await page.goto("/hero-vendor");
    await expect(
      page.getByRole("heading", { level: 1, name: /Sell more\. Give more\./ }),
    ).toBeVisible();
    await expect(page.getByText(/at least\s*5%/)).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /What is not settled yet/ }),
    ).toBeVisible();
    await expect(
      page.getByText(/makes no\s*tax-deductibility claims/),
    ).toBeVisible();
    await expect(
      page.getByText(/not affiliated with, sponsored\s*by, endorsed by/),
    ).toBeVisible();
  });

  test("standard vendors are not gated behind the Hero commitment", async ({
    page,
  }) => {
    await page.goto("/hero-vendor");
    await expect(
      page.getByText(/No contribution required, ever/),
    ).toBeVisible();
  });

  for (const route of publicRoutes) {
    test(`keeps ${route} inside a 390px viewport with touchable actions`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 900 });
      await page.goto(route);

      const sizes = await page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(sizes.scroll, `${route} horizontal overflow`).toBeLessThanOrEqual(
        sizes.client,
      );

      const actionHeights = await page
        .locator(".learnButton")
        .evaluateAll((nodes) =>
          nodes.map((node) => node.getBoundingClientRect().height),
        );
      expect(
        actionHeights.every((height) => height >= 44),
        `${route} action heights: ${actionHeights.join(", ")}`,
      ).toBe(true);
    });
  }
});
