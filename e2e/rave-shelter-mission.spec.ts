import { expect, test } from "@playwright/test";

test.describe("LostPaws and RAVE Shelter mission flow", () => {
  test("home sends visitors into the unified RAVE Shelter mission", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: "Music. Community. More resources for shelter pets.",
      }),
    ).toBeVisible();

    await page.getByRole("link", { name: "See the RAVE Shelter mission" }).click();

    await expect(page).toHaveURL(/\/rave$/);
    await expect(
      page.getByRole("heading", { name: /Music\. Community\. Shelter pets\./ }),
    ).toBeVisible();
  });

  test("direct LostPaws traffic lands in the same mission experience", async ({
    page,
  }) => {
    await page.goto("/lostpaws");

    await expect(
      page.getByRole("heading", { name: /Music\. Community\. Shelter pets\./ }),
    ).toBeVisible();
    await expect(page.getByText("LostPaws × RAVE Shelter").first()).toBeVisible();
    await expect(
      page.getByText("Music community energy for shelter pets."),
    ).toHaveCount(0);
  });

  test("mission routes each audience to the intended next step", async ({ page }) => {
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
    await expect(page.getByRole("link", { name: "RAVE Shelter" })).toBeVisible();
  });
});
