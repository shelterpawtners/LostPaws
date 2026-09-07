import { expect, test, type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const password = "Demo-only-Registration!";
const url = process.env.PLAYWRIGHT_SUPABASE_URL || "";
const key = process.env.PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY || "";

function freshEmail(persona: string) {
  return `qa-${persona}-${Date.now()}-${Math.random().toString(16).slice(2)}@example.invalid`;
}

async function register(
  page: Page,
  persona: "guardian" | "shelter" | "petbiz" | "rave_vendor",
) {
  const email = freshEmail(persona.replace("_", "-"));
  await page.goto(`/register?type=${persona}`);
  await page.getByLabel("Full name").fill(`QA ${persona}`);
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(new RegExp(`/onboarding/${persona}$`));
  return email;
}

test.describe("Persona registration and onboarding", () => {
  test.describe.configure({ timeout: 60_000 });
  test("fresh Guardian registration saves exactly one pet and guardianship", async ({
    page,
  }) => {
    const email = await register(page, "guardian");

    await page.getByLabel("Pet name").fill("QA Guardian Pet");
    await page.getByLabel("Species").selectOption("dog");

    const save = page.getByRole("button", { name: "Save and continue" });
    await save.evaluate((button: HTMLButtonElement) => {
      button.click();
      button.click();
    });

    await expect(page.getByRole("status")).toContainText(/Pet Passport started/);
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });

    const qa = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error: signInError } = await qa.auth.signInWithPassword({
      email,
      password,
    });
    expect(signInError).toBeNull();
    const { data: pets, error: petError } = await qa
      .from("pets")
      .select("id,guardianships!inner(guardian_id,status)")
      .eq("name", "QA Guardian Pet");
    expect(petError).toBeNull();
    expect(pets).toHaveLength(1);
    expect(pets?.[0].guardianships).toHaveLength(1);
    await qa.auth.signOut();
  });

  test("Guardian pet save failure is visible and retryable", async ({ page }) => {
    await register(page, "guardian");
    await page.getByLabel("Pet name").fill("Retryable Pet");
    await page.getByLabel("Species").selectOption("cat");
    await page.route("**/rest/v1/rpc/save_guardian_onboarding_pet", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "QA simulated save failure" }),
      }),
    );

    const save = page.getByRole("button", { name: "Save and continue" });
    await save.click();
    await expect(page.getByRole("status")).toContainText(
      "Unable to save your pet. QA simulated save failure",
    );
    await expect(save).toBeEnabled();
    await expect(page).toHaveURL(/\/onboarding\/guardian$/);
  });

  for (const persona of ["shelter", "petbiz", "rave_vendor"] as const) {
    test(`fresh ${persona} registration reaches its onboarding route`, async ({
      page,
    }) => {
      await register(page, persona);
      await expect(page.getByText(/setup/i).first()).toBeVisible();
    });
  }

  test("ordinary registration does not promote adding another role", async ({
    page,
  }) => {
    await page.goto("/register?type=guardian");
    await expect(page.getByText(/add another role/i)).toHaveCount(0);
  });
});
