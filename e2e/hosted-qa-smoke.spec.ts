import { expect, test, type Page } from "@playwright/test";

const hosted = process.env.PLAYWRIGHT_HOSTED_QA === "true";

function settingOrDefault(name: string, fallback: string) {
  return process.env[name] || fallback;
}

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test.describe.serial("Hosted shared-dev smoke", () => {
  test.skip(!hosted, "Set PLAYWRIGHT_HOSTED_QA=true for hosted QA runs.");
  test.describe.configure({ timeout: 90_000 });

  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const petName = `Hosted QA Pet ${suffix}`;

  test("Guardian registration entry and login lead to a persistent pet save", async ({
    page,
  }) => {
    await page.goto("/register?type=guardian");
    await expect(
      page.getByRole("heading", { name: "Create your free account" }),
    ).toBeVisible();
    await expect(page.getByLabel("Email address")).toBeVisible();

    await signIn(
      page,
      settingOrDefault("PLAYWRIGHT_GUARDIAN_EMAIL", "guardian-a@example.invalid"),
      settingOrDefault("PLAYWRIGHT_GUARDIAN_PASSWORD", "Demo-only-Guardian-A!"),
    );
    const addAnotherPet = page.getByRole("link", { name: "Add another pet" });
    const setUpPet = page.getByRole("link", { name: "Set up your pet" });
    if (await addAnotherPet.isVisible().catch(() => false)) {
      await addAnotherPet.click();
    } else {
      await expect(setUpPet).toBeVisible();
      await setUpPet.click();
    }
    await expect(page).toHaveURL(/\/onboarding\/guardian$/);

    await page.getByLabel("Pet name").fill(petName);
    await page.getByLabel("Species").selectOption("dog");
    await page.getByRole("button", { name: "Save and continue" }).click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 20_000 });
    await expect(
      page.getByRole("link", { name: `Open ${petName}` }),
    ).toBeVisible();

    await page.reload();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(
      page.getByRole("link", { name: `Open ${petName}` }),
    ).toBeVisible();
    await page.getByRole("link", { name: `Open ${petName}` }).click();
    await expect(page).toHaveURL(/\/pets\/[0-9a-f-]+$/);
    await expect(page.getByRole("heading", { name: petName })).toBeVisible();
  });

  test("logout invalidates the session and login restores pet access", async ({
    page,
  }) => {
    await signIn(
      page,
      settingOrDefault("PLAYWRIGHT_GUARDIAN_EMAIL", "guardian-a@example.invalid"),
      settingOrDefault("PLAYWRIGHT_GUARDIAN_PASSWORD", "Demo-only-Guardian-A!"),
    );
    await expect(
      page.getByRole("link", { name: `Open ${petName}` }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/$/);
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);

    await signIn(
      page,
      settingOrDefault("PLAYWRIGHT_GUARDIAN_EMAIL", "guardian-a@example.invalid"),
      settingOrDefault("PLAYWRIGHT_GUARDIAN_PASSWORD", "Demo-only-Guardian-A!"),
    );
    await expect(
      page.getByRole("link", { name: `Open ${petName}` }),
    ).toBeVisible();
  });

  test("seeded Partner can open marketplace and Partner offer management", async ({
    page,
  }) => {
    await page.goto("/marketplace");
    await expect(
      page.getByRole("heading", { name: "Find value that fits your world." }),
    ).toBeVisible();

    await signIn(
      page,
      settingOrDefault("PLAYWRIGHT_PARTNER_EMAIL", "partner-admin@example.invalid"),
      settingOrDefault("PLAYWRIGHT_PARTNER_PASSWORD", "Demo-only-Partner!"),
    );
    await page.goto("/partner/offers");
    await expect(
      page.getByRole("heading", {
        name: "Create clear offers without rewriting history.",
      }),
    ).toBeVisible();
  });
});
