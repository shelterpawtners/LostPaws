import { expect, test } from "@playwright/test";
import {
  expectRuntimeClean,
  issue5Hosted,
  requiredSetting,
  signInPage,
  watchRuntime,
} from "./helpers/issue5";

const widths = [1440, 1280, 1024, 768, 390, 360];

test.describe("Issue #283 Offer Manager layout", () => {
  test.skip(!issue5Hosted, "Run through acceptance-gated Hosted QA.");

  test("keeps offer controls inside their containers across supported widths", async ({
    page,
  }) => {
    const failures = watchRuntime(page);
    await signInPage(
      page,
      requiredSetting("PLAYWRIGHT_PARTNER_EMAIL"),
      requiredSetting("PLAYWRIGHT_PARTNER_PASSWORD"),
    );

    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/partner/offers?channel=rave");
      await expect(
        page.getByRole("heading", { name: "Create a new offer" }),
      ).toBeVisible({ timeout: 15_000 });
      await expect(page.getByLabel("Offer audience")).toHaveValue("rave");

      const overflow = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth - window.innerWidth,
        manager: (() => {
          const element = document.querySelector(".offerManagerPage");
          if (!element) return 0;
          const rect = element.getBoundingClientRect();
          return Math.max(0, rect.right - window.innerWidth, -rect.left);
        })(),
      }));
      expect(overflow.document, `page overflow at ${width}px`).toBeLessThanOrEqual(1);
      expect(overflow.manager, `Offer Manager overflow at ${width}px`).toBeLessThanOrEqual(1);

      const escapedText = await page
        .locator(".offerManagerPage .role, .offerManagerPage label")
        .evaluateAll((elements) =>
          elements.some((element) => {
            const range = document.createRange();
            range.selectNodeContents(element);
            const box = range.getBoundingClientRect();
            const container = element.getBoundingClientRect();
            return box.right > container.right + 1 || box.left < container.left - 1;
          }),
        );
      expect(escapedText, `text escapes an Offer Manager container at ${width}px`).toBeFalsy();
    }

    expectRuntimeClean(failures);
  });
});
