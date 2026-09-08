import { expect, test, type Page } from "@playwright/test";

const hosted = process.env.PLAYWRIGHT_HOSTED_QA === "true";
const runSuffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

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

async function signOut(page: Page) {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/$/);
}

test.describe.serial("Hosted partner-to-guardian marketplace golden path", () => {
  test.skip(!hosted, "Set PLAYWRIGHT_HOSTED_QA=true for hosted QA runs.");
  test.describe.configure({ timeout: 120_000 });

  test("partner profile persistence and offer redemption remain functional", async ({
    page,
  }) => {
    const publicDescription = `Hosted QA profile persistence ${runSuffix}`;
    const publicEmail = `qa-partner-${runSuffix}@example.invalid`;
    const offerTitle = `Hosted QA welcome offer ${runSuffix}`;
    const offerTerms = `Hosted QA terms ${runSuffix}`;
    const offerUsage = `Show this hosted QA code ${runSuffix}.`;

    await signIn(
      page,
      settingOrDefault("PLAYWRIGHT_PARTNER_EMAIL", "partner-admin@example.invalid"),
      settingOrDefault("PLAYWRIGHT_PARTNER_PASSWORD", "Demo-only-Partner!"),
    );
    await page.goto("/business");
    const saveDraftButton = page.getByRole("button", { name: "Save draft" });
    await expect(saveDraftButton).toBeEnabled({ timeout: 15_000 });
    const organization = page.getByLabel("Organization");
    await expect(organization).not.toHaveValue("");
    await page.getByLabel("Public description").fill(publicDescription);
    await page.getByLabel("Public email").fill(publicEmail);
    await page.getByLabel("How customers are served").selectOption("online");
    await saveDraftButton.click();
    await expect(saveDraftButton).toBeEnabled({ timeout: 15_000 });
    const saveStatus = page.locator(".panel > p[role='status']").last();
    await expect(saveStatus).toContainText("Saved as a private draft.");
    const selectedOrganizationId = await organization.inputValue();
    await page.reload();
    await expect(saveDraftButton).toBeEnabled({ timeout: 15_000 });
    await expect(organization).toHaveValue(selectedOrganizationId);
    await expect(page.getByLabel("Public description")).toHaveValue(
      publicDescription,
      { timeout: 15_000 },
    );
    await expect(page.getByLabel("Public email")).toHaveValue(publicEmail, {
      timeout: 15_000,
    });
    const publishProfile = page.getByRole("button", {
      name: "Publish profile",
      exact: true,
    });
    if ((await publishProfile.count()) > 0) {
      await publishProfile.click();
      await expect(page.getByText("Published.")).toBeVisible();
    }

    await page.goto("/partner/offers");
    await expect(page.getByTestId("marketplace-profile-state")).toContainText(
      "Marketplace profile: published",
    );
    await page.getByLabel("Title").fill(offerTitle);
    await page
      .getByLabel("Short description")
      .fill("A hosted QA golden-path offer.");
    await page.getByLabel("Terms and conditions").fill(offerTerms);
    await page.getByLabel("How customers use it").fill(offerUsage);
    await page.getByLabel("Per-user limit").fill("1");
    await page.getByRole("button", { name: "Preview" }).click();
    await expect(page.getByText("Preview · all pets")).toBeVisible();
    await page.getByRole("button", { name: "Save new version" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Saved as a new draft version",
    );
    await page.getByRole("button", { name: "Publish or schedule" }).click();
    await expect(page.getByRole("status")).toContainText("publish complete");

    await signOut(page);
    await signIn(
      page,
      settingOrDefault("PLAYWRIGHT_GUARDIAN_EMAIL", "guardian-a@example.invalid"),
      settingOrDefault("PLAYWRIGHT_GUARDIAN_PASSWORD", "Demo-only-Guardian-A!"),
    );
    await page.goto("/marketplace");
    const card = page.locator(".offerCard", { hasText: offerTitle });
    await expect(card).toBeVisible();
    await card.getByRole("link", { name: "View offer details" }).click();
    await expect(page.getByText(offerTerms)).toBeVisible();
    await page.getByRole("button", { name: "Claim this offer" }).click();
    await expect(page.getByRole("status")).toContainText("Claim ready");
    const redeemCode =
      (await page.locator(".redemptionCode code").textContent()) ?? "";
    expect(redeemCode).toHaveLength(64);

    await signOut(page);
    await signIn(
      page,
      settingOrDefault("PLAYWRIGHT_PARTNER_EMAIL", "partner-admin@example.invalid"),
      settingOrDefault("PLAYWRIGHT_PARTNER_PASSWORD", "Demo-only-Partner!"),
    );
    await page.goto(`/redeem/${redeemCode}`);
    await expect(page.getByRole("heading", { name: offerTitle })).toBeVisible();
    await expect(page.getByText("Valid claim")).toBeVisible();
    await page.getByRole("button", { name: "Confirm utilization" }).click();
    await expect(page.getByRole("status")).toContainText("Utilization confirmed");
  });
});
