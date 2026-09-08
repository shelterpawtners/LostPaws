import { expect, test, type Page } from "@playwright/test";

const hosted = process.env.PLAYWRIGHT_HOSTED_QA === "true";
const adminCredentialsConfigured = Boolean(
  process.env.PLAYWRIGHT_ADMIN_EMAIL &&
    process.env.PLAYWRIGHT_ADMIN_PASSWORD &&
    process.env.PLAYWRIGHT_NON_ADMIN_EMAIL &&
    process.env.PLAYWRIGHT_NON_ADMIN_PASSWORD,
);

function requiredSetting(name: string) {
  const value = process.env[name];
  if (!value)
    throw new Error(
      `${name} is required for Admin QA hosted regression. Configure it as a GitHub Actions secret; do not commit it.`,
    );
  return value;
}

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

async function signInAsAdmin(page: Page) {
  await signIn(
    page,
    requiredSetting("PLAYWRIGHT_ADMIN_EMAIL"),
    requiredSetting("PLAYWRIGHT_ADMIN_PASSWORD"),
  );
}

async function openAdminQa(page: Page) {
  await page.goto("/admin-qa");
  await expect(
    page.getByRole("heading", { name: "Admin QA Mode" }),
  ).toBeVisible();
}

test.describe.serial("Admin QA mode hosted regression", () => {
  test.skip(
    !hosted || !adminCredentialsConfigured,
    "Set PLAYWRIGHT_HOSTED_QA=true and admin/non-admin QA credentials for hosted Admin QA runs.",
  );
  test.describe.configure({ timeout: 90_000 });

  test("only a platform admin can open Admin QA Mode", async ({ page }) => {
    await signInAsAdmin(page);
    await openAdminQa(page);
  });

  test("a non-admin is redirected away from Admin QA Mode", async ({
    page,
  }) => {
    await signIn(
      page,
      requiredSetting("PLAYWRIGHT_NON_ADMIN_EMAIL"),
      requiredSetting("PLAYWRIGHT_NON_ADMIN_PASSWORD"),
    );
    await page.goto("/admin-qa");
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(
      page.getByRole("heading", { name: "Admin QA Mode" }),
    ).toHaveCount(0);
  });

  test("cards and visible CTAs switch real personas and preserve the admin session", async ({
    page,
  }) => {
    await signInAsAdmin(page);
    await openAdminQa(page);

    const guardianCard = page.getByRole("button", {
      name: /Act as Guardian A, Guardian, Demo Pet A/,
    });
    await expect(guardianCard).toHaveCSS("cursor", "pointer");
    await guardianCard.click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("status")).toContainText(
      "ADMIN QA MODE — Acting as Guardian A (Guardian)",
    );
    await expect(
      page.getByRole("link", { name: "Open Demo Pet A" }),
    ).toBeVisible();

    await page.goto("/marketplace");
    await expect(page.getByRole("status")).toContainText("Guardian A");
    await page.reload();
    await expect(page.getByRole("status")).toContainText(
      "ADMIN QA MODE — Acting as Guardian A (Guardian)",
    );
    await page.goto("/admin-qa");
    await expect(
      page.getByRole("heading", { name: "Admin QA Mode" }),
    ).toBeVisible();

    const partnerCta = page
      .getByRole("button", {
        name: /Act as Partner Admin, Partner, Demo PetBiz A/,
      })
      .getByText("Act as", { exact: true });
    await partnerCta.click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("status")).toContainText(
      "ADMIN QA MODE — Acting as Partner Admin (Partner)",
    );

    await page.goto("/admin-qa");
    const shelterCard = page.getByRole("button", {
      name: /Act as Shelter Admin, Shelter, Demo Shelter B/,
    });
    await shelterCard.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("status")).toContainText(
      "ADMIN QA MODE — Acting as Shelter Admin (Shelter)",
    );

    await page.getByRole("button", { name: "Return to Admin" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await page.goto("/admin-qa");
    await expect(
      page.getByRole("heading", { name: "Admin QA Mode" }),
    ).toBeVisible();
  });

  test("a fresh Guardian QA account is confirmed and enters Guardian onboarding", async ({
    page,
  }) => {
    await signInAsAdmin(page);
    await openAdminQa(page);
    await page
      .getByRole("button", { name: "Create fresh Guardian test account" })
      .click();
    await expect(page).toHaveURL(/\/onboarding\/guardian$/);
    await expect(page.getByRole("status")).toContainText("ADMIN QA MODE");
    await expect(page.getByLabel("Pet name")).toBeVisible();
  });

  test("an Edge Function error is visible and never reports false QA success", async ({
    page,
  }) => {
    await signInAsAdmin(page);
    await openAdminQa(page);
    await page.route("**/functions/v1/admin-qa-session", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "QA simulated Edge Function failure" }),
      }),
    );
    await page
      .getByRole("button", { name: /Act as Guardian A, Guardian, Demo Pet A/ })
      .click();
    await expect(page.getByRole("alert")).toContainText(
      /Unable to start QA mode|Edge Function|QA simulated/,
    );
    await expect(page.getByText("ADMIN QA MODE")).toHaveCount(0);
  });
});
