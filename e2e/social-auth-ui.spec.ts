import { expect, test } from "@playwright/test";

const registrationKinds = ["guardian", "shelter", "petbiz", "rave_vendor"];

test.describe("Social auth launch UI", () => {
  for (const kind of registrationKinds) {
    test(`shows a feature-gated Facebook action for ${kind} signup`, async ({ page }) => {
      await page.goto(`/register?type=${kind}`);

      const facebook = page.getByRole("button", { name: /Facebook/ });
      await expect(facebook).toBeVisible();

      const label = await facebook.textContent();
      if (label?.includes("coming soon")) {
        await expect(facebook).toBeDisabled();
      } else {
        await expect(facebook).toBeEnabled();
        await expect(facebook).toHaveText("Continue with Facebook");
      }
    });
  }

  test("shows the same feature-gated Facebook action on sign in", async ({ page }) => {
    await page.goto("/login");

    const facebook = page.getByRole("button", { name: /Facebook/ });
    await expect(facebook).toBeVisible();

    const label = await facebook.textContent();
    if (label?.includes("coming soon")) {
      await expect(facebook).toBeDisabled();
    } else {
      await expect(facebook).toBeEnabled();
      await expect(facebook).toHaveText("Continue with Facebook");
    }
  });
});
