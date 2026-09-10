import { expect, test } from "@playwright/test";

test.describe("Launch auth recovery", () => {
  test("forgot-password sends recovery back to this app reset route", async ({
    page,
  }) => {
    let redirectTo = "";
    await page.route("**/auth/v1/recover**", async (route) => {
      redirectTo =
        new URL(route.request().url()).searchParams.get("redirect_to") || "";
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "{}",
      });
    });

    await page.goto("/forgot-password");
    await page.getByLabel("Email address").fill("recovery-check@example.invalid");
    await page.getByRole("button", { name: "Send recovery email" }).click();

    await expect(page.getByRole("status")).toContainText(
      "If that address has an account, a recovery email is on its way.",
    );
    expect(redirectTo).not.toBe("");
    const target = new URL(redirectTo);
    expect(target.origin).toBe(new URL(page.url()).origin);
    expect(target.pathname).toBe("/reset-password");
  });

  test("reset-password without a recovery session does not show an active password form", async ({
    page,
  }) => {
    await page.goto("/reset-password");

    await expect(
      page.getByRole("heading", { name: "Recovery link unavailable" }),
    ).toBeVisible();
    await expect(page.getByLabel("New password")).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Request a new recovery email" }),
    ).toBeVisible();
  });
});
