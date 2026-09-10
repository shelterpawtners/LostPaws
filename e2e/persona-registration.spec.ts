import { expect, test, type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const password = "Demo-only-Registration!";
const url = process.env.PLAYWRIGHT_SUPABASE_URL || "";
const key = process.env.PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY || "";
const hostedQa = process.env.PLAYWRIGHT_HOSTED_QA === "true";
const hostedSignupReason =
  "Fresh email signup runs in Persona QA against isolated local Supabase; hosted Auth email delivery is externally rate-limited.";

function client() {
  if (!url || !key)
    throw new Error("Local Supabase test settings are missing.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

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

  for (const persona of [
    "guardian",
    "shelter",
    "petbiz",
    "rave_vendor",
  ] as const) {
    test(`email confirmation for ${persona} returns to its onboarding route`, async ({
      page,
    }) => {
      test.skip(hostedQa, hostedSignupReason);
      let redirectTo = "";
      await page.route("**/auth/v1/signup**", async (route) => {
        redirectTo =
          new URL(route.request().url()).searchParams.get("redirect_to") || "";
        await route.continue();
      });

      await register(page, persona);

      expect(redirectTo).not.toBe("");
      const confirmationTarget = new URL(redirectTo);
      expect(confirmationTarget.origin).toBe(new URL(page.url()).origin);
      expect(confirmationTarget.pathname).toBe(`/onboarding/${persona}`);
    });
  }

  test("fresh Guardian registration saves exactly one pet and guardianship", async ({
    page,
  }) => {
    test.skip(hostedQa, hostedSignupReason);
    const email = await register(page, "guardian");

    await page.getByLabel("Pet name").fill("QA Guardian Pet");
    await page.getByLabel("Species").selectOption("dog");

    const save = page.getByRole("button", { name: "Save and continue" });
    await save.evaluate((button: HTMLButtonElement) => {
      button.click();
      button.click();
    });

    await expect(page.getByRole("status")).toContainText(
      /Pet Passport started/,
    );
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
    await expect(
      page.getByRole("link", { name: "Open QA Guardian Pet" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Set up your pet" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Add another pet" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Open QA Guardian Pet" }).click();
    await expect(page).toHaveURL(/\/pets\/[0-9a-f-]+$/);
    await expect(page).not.toHaveURL(/\/onboarding\/guardian$/);
    await expect(
      page.getByRole("heading", { name: "QA Guardian Pet" }),
    ).toBeVisible();

    const qa = client();
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

  test("Guardian pet save failure is visible and retryable", async ({
    page,
  }) => {
    test.skip(hostedQa, hostedSignupReason);
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

  test("Guardian pet save recovers when session verification fails", async ({
    page,
  }) => {
    test.skip(hostedQa, hostedSignupReason);
    await register(page, "guardian");
    await page.getByLabel("Pet name").fill("Session Retry Pet");
    await page.getByLabel("Species").selectOption("dog");
    await page.route("**/auth/v1/user", (route) =>
      route.abort("connectionfailed"),
    );

    const save = page.getByRole("button", { name: "Save and continue" });
    await save.click();
    await expect(page.getByRole("status")).toContainText(
      "Unable to verify your session. Check your connection and try again.",
    );
    await expect(save).toBeEnabled();
    await expect(page).toHaveURL(/\/onboarding\/guardian$/);
  });

  for (const persona of ["shelter", "petbiz", "rave_vendor"] as const) {
    test(`fresh ${persona} registration reaches its onboarding route`, async ({
      page,
    }) => {
      test.skip(hostedQa, hostedSignupReason);
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
