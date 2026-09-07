import { expect, test } from "@playwright/test";

const hasLocalSupabase = Boolean(
  process.env.PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY,
);

test.describe("Phase 2 checkpoint 1 partner organization onboarding", () => {
  test.skip(!hasLocalSupabase, "Local Supabase publishable key is required");

  test("keeps entry-first details, surfaces a match, and offers safe next actions", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Email address").fill("partner-b@example.invalid");
    await page.getByLabel("Password").fill("Demo-only-Partner-B!");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto("/onboarding/petbiz");
    await expect(
      page.getByRole("heading", { name: "Start with your business details." }),
    ).toBeVisible();
    await page.getByLabel("Public business name").fill("Demo PetBiz A");
    await expect(
      page.getByRole("heading", { name: "Possible matches" }),
    ).toBeVisible();
    await expect(page.getByText("Demo PetBiz A").last()).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Request access" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Claim review" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Not my business" }).click();
    await expect(page.getByText("Marked as not my business")).toBeVisible();
    await expect(page.getByLabel("Public business name")).toHaveValue(
      "Demo PetBiz A",
    );
  });
});
