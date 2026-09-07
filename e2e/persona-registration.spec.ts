import { expect, test, type Page } from "@playwright/test";

const password = "Demo-only-Registration!";

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
  test("fresh Guardian registration saves pet and advances", async ({ page }) => {
    await register(page, "guardian");

    await page.getByLabel("Pet name").fill("QA Guardian Pet");
    await page.getByLabel("Species").selectOption("dog");

    const save = page.getByRole("button", { name: "Save and continue" });
    await save.click();

    await expect(page.getByRole("status")).toContainText(
      /Saving|Pet Passport started|Pet saved/,
    );
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 5_000 });
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
