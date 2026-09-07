import { createClient } from "@supabase/supabase-js";
import { expect, test, type Page } from "@playwright/test";

const url = process.env.PLAYWRIGHT_SUPABASE_URL || "";
const key = process.env.PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY || "";
const registrationPassword = "Demo-only-Registration!";

function client() {
  if (!url || !key)
    throw new Error("Local Supabase test settings are missing.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test.describe("Guardian pet-centric dashboard", () => {
  test.describe.configure({ timeout: 60_000 });

  test("Guardian with two active pets sees and can select both", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const secondPetName = `Second QA Pet ${Date.now()}`;
    const qa = client();
    const { error: signInError } = await qa.auth.signInWithPassword({
      email: "guardian-a@example.invalid",
      password: "Demo-only-Guardian-A!",
    });
    expect(signInError).toBeNull();
    const { error: saveError } = await qa.rpc("save_guardian_onboarding_pet", {
      p_submission_id: crypto.randomUUID(),
      p_name: secondPetName,
      p_species: "cat",
      p_adopted: false,
    });
    expect(saveError).toBeNull();
    await qa.auth.signOut();

    await signIn(page, "guardian-a@example.invalid", "Demo-only-Guardian-A!");
    await expect(
      page.getByRole("link", { name: "Open Demo Pet A" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: `Open ${secondPetName}` }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Set up your pet" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Add another pet" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);

    const secondPet = page.getByRole("link", { name: `Open ${secondPetName}` });
    await secondPet.focus();
    await expect(secondPet).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/pets\/[0-9a-f-]+$/);
    await expect(
      page.getByRole("heading", { name: secondPetName }),
    ).toBeVisible();
  });

  test("Guardian with no active pets sees only the setup empty state", async ({
    page,
  }) => {
    const email = `qa-empty-guardian-${Date.now()}@example.invalid`;
    await page.goto("/register?type=guardian");
    await page.getByLabel("Full name").fill("Empty Guardian");
    await page.getByLabel("Email address").fill(email);
    await page.getByLabel("Password").fill(registrationPassword);
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page).toHaveURL(/\/onboarding\/guardian$/);
    await page.goto("/dashboard");

    await expect(
      page.getByRole("link", { name: "Set up your pet" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Add another pet" }),
    ).toHaveCount(0);
  });

  test("Guardian B dashboard does not show Guardian A pets", async ({
    page,
  }) => {
    await signIn(page, "guardian-b@example.invalid", "Demo-only-Guardian-B!");
    await expect(
      page.getByRole("link", { name: "Open Demo Pet B" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open Demo Pet A" }),
    ).toHaveCount(0);
  });
});
