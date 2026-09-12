import { expect, test } from "@playwright/test";

test.describe("LostPaws and RAVE Shelter mission flow", () => {
  test("home sends visitors into the RAVE Shelter mission", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: "Rave with purpose. Shop with impact.",
      }),
    ).toBeVisible();

    await page
      .getByRole("link", { name: "See the RAVE Shelter mission" })
      .click();

    await expect(page).toHaveURL(/\/rave$/);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Rave with purpose\. Shop with impact\./,
      }),
    ).toBeVisible();
  });

  // Direct /lostpaws landing (distinct LostPaws page vs /rave) is covered by
  // e2e/issue-125-rave-lostpaws-mobile.spec.ts; not duplicated here.

  test("mission routes each audience to the intended next step", async ({
    page,
  }) => {
    await page.goto("/rave");

    await expect(
      page.getByRole("link", { name: "Browse RAVE offers" }),
    ).toHaveAttribute("href", /marketplace\?channel=rave$/);
    await expect(
      page.getByRole("link", { name: "Create a Guardian account" }),
    ).toHaveAttribute("href", /register\?type=guardian$/);
    await expect(
      page.getByRole("link", { name: "Join RAVE Shelter" }),
    ).toHaveAttribute("href", /register\?type=rave_vendor$/);
    await expect(
      page.getByRole("link", { name: "Register a shelter" }),
    ).toHaveAttribute("href", /register\?type=shelter$/);
  });

  test("global navigation remains available on the campaign experience", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/lostpaws");

    const menu = page.locator(".menu");
    await menu.click();
    await expect(page.getByRole("link", { name: "Marketplace" })).toBeVisible();
    await expect(page.getByRole("link", { name: "LostPaws" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "RAVE Shelter", exact: true }),
    ).toBeVisible();
  });
});
