import { expect, test } from "@playwright/test";

/**
 * Events had schema, RLS, and pgTAP coverage but no interface, so the feature
 * was invisible. These guard the browse surface a reviewer actually sees.
 *
 * Runs against the seeded demo events in supabase/seed.sql, so this suite
 * needs a database and belongs with Persona QA rather than the
 * credential-free test:e2e:public suite. Credential-free coverage of /events
 * (overflow, title, heading order, touch targets) lives in site-hygiene.
 */
test.describe("Events", () => {
  test("lists published events with their date and place", async ({ page }) => {
    await page.goto("/events");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Adoption days, festivals, and markets/,
      }),
    ).toBeVisible();

    const adoption = page.locator(".evCard", {
      hasText: "Demo Saturday Adoption Day",
    });
    await expect(adoption).toBeVisible();
    // A real date and place, not a placeholder.
    await expect(adoption).not.toContainText("Date to be announced");
    await expect(adoption).toContainText("Detroit, MI");
  });

  test("audience filters separate pet and human events", async ({ page }) => {
    await page.goto("/events");
    const adoption = page.locator(".evCard", {
      hasText: "Demo Saturday Adoption Day",
    });
    const market = page.locator(".evCard", { hasText: "Demo Makers Market" });
    await expect(adoption).toBeVisible();
    await expect(market).toBeVisible();

    await page.getByRole("button", { name: "Pet events" }).click();
    await expect(adoption).toBeVisible();
    await expect(market).toHaveCount(0);

    await page.getByRole("button", { name: "Human events" }).click();
    await expect(market).toBeVisible();
    await expect(adoption).toHaveCount(0);
  });

  test("a cross-audience event appears under both filters", async ({
    page,
  }) => {
    const walk = "Demo Community Dog Walk";
    await page.goto("/events");
    await page.getByRole("button", { name: "Pet events" }).click();
    await expect(page.locator(".evCard", { hasText: walk })).toBeVisible();
    await page.getByRole("button", { name: "Human events" }).click();
    await expect(page.locator(".evCard", { hasText: walk })).toBeVisible();
  });

  test("signed-out visitors see no add-event control", async ({ page }) => {
    await page.goto("/events");
    await expect(
      page.getByRole("button", { name: /Add an event/ }),
    ).toHaveCount(0);
  });
});
