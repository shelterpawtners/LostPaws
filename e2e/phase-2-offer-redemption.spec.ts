import { expect, test, type Page } from "@playwright/test";

test.describe.serial("Phase 2 offer and redemption journey", () => {
  let redeemCode = "";

  async function signIn(page: Page, email: string, password: string) {
    await page.goto("/login");
    await page.getByLabel("Email address").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  }

  test("Partner creates, previews, and publishes an offer", async ({
    page,
  }) => {
    await signIn(page, "partner-admin@example.invalid", "Demo-only-Partner!");
    await page.goto("/business");
    await page
      .getByLabel("Public description")
      .fill(
        "A focused Playwright Partner profile for the marketplace golden path.",
      );
    await page.getByLabel("Public email").fill("partner@example.invalid");
    await page.getByLabel("How customers are served").selectOption("online");
    await page.getByRole("button", { name: "Save draft" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Saved as a private draft",
    );
    const organization = page.getByLabel("Organization");
    const selectedOrganizationId = await organization.inputValue();
    await page.reload();
    await expect(organization).toHaveValue(selectedOrganizationId);
    await expect(page.getByLabel("Public description")).toHaveValue(
      "A focused Playwright Partner profile for the marketplace golden path.",
    );
    await expect(page.getByLabel("Public email")).toHaveValue(
      "partner@example.invalid",
    );
    await page
      .getByRole("button", { name: "Publish profile", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText("Published.");

    await page.goto("/partner/offers");
    await expect(page.getByTestId("marketplace-profile-state")).toContainText(
      "Marketplace profile: published",
    );
    await page.getByLabel("Title").fill("Playwright welcome offer");
    await page
      .getByLabel("Short description")
      .fill("A test-only Partner offer with clear terms.");
    await page
      .getByLabel("Terms and conditions")
      .fill("Demo only. One claim per guardian.");
    await page
      .getByLabel("How customers use it")
      .fill("Show the private code at checkout.");
    await page.getByLabel("Per-user limit").fill("1");
    await page.getByRole("button", { name: "Preview" }).click();
    await expect(page.getByText("Preview · all pets")).toBeVisible();
    await page.getByRole("button", { name: "Save new version" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Saved as a new draft version",
    );
    await page.getByRole("button", { name: "Publish or schedule" }).click();
    await expect(page.getByRole("status")).toContainText("publish complete");
  });

  test("Guardian sees current terms and claims the exact offer", async ({
    page,
  }) => {
    await signIn(page, "guardian-a@example.invalid", "Demo-only-Guardian-A!");
    await page.goto("/marketplace");
    const card = page.locator(".offerCard", {
      hasText: "Playwright welcome offer",
    });
    await expect(card).toBeVisible();
    await card.getByRole("link", { name: "View offer details" }).click();
    await page.reload();
    await expect(
      page.getByText("Demo only. One claim per guardian."),
    ).toBeVisible();
    await page.getByRole("button", { name: "Claim this offer" }).click();
    await expect(page.getByRole("status")).toContainText("Claim ready");
    redeemCode =
      (await page.locator(".redemptionCode code").textContent()) || "";
    expect(redeemCode).toHaveLength(64);
    await expect(page.locator(".redemptionCode")).toContainText(
      "contains no name, email, or pet information",
    );
  });

  test("Partner validates and confirms once; replay fails safely", async ({
    page,
  }) => {
    await signIn(page, "partner-admin@example.invalid", "Demo-only-Partner!");
    await page.goto(`/redeem/${redeemCode}`);
    await expect(
      page.getByRole("heading", { name: "Playwright welcome offer" }),
    ).toBeVisible();
    await expect(page.getByText("Valid claim")).toBeVisible();
    await page.getByRole("button", { name: "Confirm utilization" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Utilization confirmed",
    );
    await page.getByLabel("Manual redemption code").fill(redeemCode);
    await page.getByRole("button", { name: "Validate code" }).click();
    await expect(page.getByRole("status")).toContainText(
      "invalid, expired, used, or belongs to another Partner",
    );
  });

  test("camera-unavailable path keeps manual entry available", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signIn(page, "partner-admin@example.invalid", "Demo-only-Partner!");
    await page.goto("/redeem");
    await page.getByRole("button", { name: "Scan QR with camera" }).click();
    await expect(page.getByLabel("Manual redemption code")).toBeVisible();
    await expect(page.getByRole("status")).toContainText(
      /Camera scanning|manual code/,
    );
    const layout = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
    const scanHeight = await page
      .getByRole("button", { name: "Scan QR with camera" })
      .evaluate((button) => button.getBoundingClientRect().height);
    expect(scanHeight).toBeGreaterThanOrEqual(44);
  });
});
