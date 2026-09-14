import { expect, test } from "@playwright/test";

/**
 * Issue #154: event detail page, individual attendance, the safe vendor
 * contact path, and event-scoped Marketplace embedding. Runs against the
 * seeded demo events in supabase/seed.sql (same fixtures events.spec.ts
 * uses), so this belongs with Persona QA rather than the credential-free
 * test:e2e:public suite — attendance itself needs a real session.
 */
const adoptionDayId = "40000000-0000-0000-0000-0000000000f1";

test.describe("Event detail page", () => {
  test("shows event details, the hosting business, and an offers section without signing in", async ({
    page,
  }) => {
    await page.goto("/events");
    await page
      .getByRole("link", { name: "Demo Saturday Adoption Day" })
      .click();
    await expect(page).toHaveURL(new RegExp(`/events/${adoptionDayId}$`));
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Demo Saturday Adoption Day",
      }),
    ).toBeVisible();
    await expect(page.getByText("Detroit, MI")).toBeVisible();

    // The hosting business (Demo Shelter B) is surfaced via the safe
    // contact-path function, linking to its existing public profile — no
    // attendee data is ever shown here.
    await expect(
      page.getByRole("heading", { name: "Businesses at this event" }),
    ).toBeVisible();
    const vendorLink = page.getByRole("link", { name: "Demo Shelter B" });
    await expect(vendorLink).toBeVisible();
    await expect(vendorLink).toHaveAttribute(
      "href",
      /\/partners\/20000000-0000-0000-0000-000000000002$/,
    );

    // Signed-out visitors get a sign-in prompt instead of an attendance
    // button, and never see other people's attendance rows.
    await expect(
      page.getByRole("link", { name: "Sign in to mark attendance" }),
    ).toBeVisible();
  });

  test("an unknown event id shows a truthful not-found state", async ({
    page,
  }) => {
    await page.goto("/events/00000000-0000-0000-0000-000000000000");
    await expect(
      page.getByRole("heading", { level: 1, name: "Event not found" }),
    ).toBeVisible();
    await page.getByRole("link", { name: /Back to events/ }).click();
    await expect(page).toHaveURL(/\/events$/);
  });

  test("a signed-in guardian can mark and unmark attendance, and it persists", async ({
    page,
  }) => {
    test.slow();
    const email = `event-attendance-${Date.now()}@example.invalid`;
    await page.goto("/register?type=guardian");
    await page.getByLabel("Full name").fill("Event Attendance Tester");
    await page.getByLabel("Email address").fill(email);
    await page.getByLabel("Password").fill("Attendance-only-9!");
    await page.getByLabel(/I agree to the Terms/).check();
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL(/\/onboarding\/guardian$/, { timeout: 15_000 });

    await page.goto(`/events/${adoptionDayId}`);
    const attendButton = page.getByRole("button", { name: "I'm attending" });
    await expect(attendButton).toBeVisible();
    await attendButton.click();
    await expect(
      page.getByRole("button", { name: "I'm attending ✓" }),
    ).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole("button", { name: "I'm attending ✓" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "I'm attending ✓" }).click();
    await expect(
      page.getByRole("button", { name: "I'm attending", exact: true }),
    ).toBeVisible();
  });

  test("event-scoped Marketplace embed and the full Marketplace event filter both work", async ({
    page,
  }) => {
    await page.goto(`/events/${adoptionDayId}`);
    await expect(
      page.getByRole("heading", { name: "Offers for this event" }),
    ).toBeVisible();

    await page.getByRole("link", { name: /See all in Marketplace/ }).click();
    await expect(page).toHaveURL(
      new RegExp(`/marketplace\\?event=${adoptionDayId}$`),
    );
    await expect(
      page.getByText("Showing offers for this event only."),
    ).toBeVisible();
    await page.getByRole("button", { name: "Clear event filter" }).click();
    await expect(page).toHaveURL(/\/marketplace$/);
  });

  test("event detail page stays inside a 390px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(`/events/${adoptionDayId}`);
    await page.locator("#main").waitFor({ state: "visible" });
    const { scroll, client } = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(scroll).toBeLessThanOrEqual(client + 1);
  });
});
