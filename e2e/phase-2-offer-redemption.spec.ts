import { createClient } from "@supabase/supabase-js";
import { expect, test, type Page } from "@playwright/test";

const runSuffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const offerTitle = `Playwright welcome offer ${runSuffix}`;
const partnerOrganizationName = `Playwright real Partner ${runSuffix}`;

test.describe.serial("Phase 2 offer and redemption journey", () => {
  let redeemCode = "";
  let partnerOrganizationId = "";

  async function signIn(page: Page, email: string, password: string) {
    await page.goto("/login");
    await page.getByLabel("Email address").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  }

  test.beforeAll(async () => {
    const supabaseUrl = process.env.PLAYWRIGHT_SUPABASE_URL;
    const supabaseKey = process.env.PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY;
    expect(supabaseUrl).toBeTruthy();
    expect(supabaseKey).toBeTruthy();

    const partnerDb = createClient(supabaseUrl!, supabaseKey!);
    const signInResult = await partnerDb.auth.signInWithPassword({
      email: "partner-admin@example.invalid",
      password: "Demo-only-Partner!",
    });
    expect(signInResult.error).toBeNull();
    const userId = signInResult.data.user?.id;
    expect(userId).toBeTruthy();

    const { data: draft, error: draftError } = await partnerDb
      .from("organization_onboarding_drafts")
      .upsert(
        {
          created_by: userId!,
          partner_kind: "petbiz",
          form_data: {
            name: partnerOrganizationName,
            relationship: "independent",
            additionalLocations: [],
          },
          status: "editing",
          resolved_organization_id: null,
          resolution_note: null,
        },
        { onConflict: "created_by" },
      )
      .select("id")
      .single();
    expect(draftError).toBeNull();
    expect(draft?.id).toBeTruthy();

    const { data: organizationId, error: organizationError } =
      await partnerDb.rpc("create_partner_organization", {
        p_partner_kind: "petbiz",
        p_form: {
          name: partnerOrganizationName,
          relationship: "independent",
          additionalLocations: [],
        },
        p_draft_id: draft!.id,
      });
    expect(organizationError).toBeNull();
    expect(organizationId).toBeTruthy();
    partnerOrganizationId = organizationId as string;

    const { data: createdOrganization, error: createdOrganizationError } =
      await partnerDb
        .from("organizations")
        .select("id,is_demo")
        .eq("id", partnerOrganizationId)
        .single();
    expect(createdOrganizationError).toBeNull();
    expect(createdOrganization).toMatchObject({
      id: partnerOrganizationId,
      is_demo: false,
    });
  });

  test("Partner creates, previews, and publishes an offer", async ({
    page,
  }) => {
    await signIn(page, "partner-admin@example.invalid", "Demo-only-Partner!");
    await page.goto("/business");
    const organization = page.getByLabel("Organization");
    await expect(organization).toContainText(partnerOrganizationName, {
      timeout: 15_000,
    });
    await organization.selectOption(partnerOrganizationId);
    await expect(page.getByTestId("partner-profile-save-status")).toHaveText(
      /^(draft|published|unpublished)$/i,
      { timeout: 15_000 },
    );
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
    await page.reload();
    await expect(organization).toHaveValue(partnerOrganizationId);
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
    const offerOrganization = page
      .locator("aside.rolePanel")
      .getByRole("combobox")
      .first();
    await expect(offerOrganization).toContainText(partnerOrganizationName, {
      timeout: 15_000,
    });
    await offerOrganization.selectOption(partnerOrganizationId);
    await expect(page.getByTestId("marketplace-profile-state")).toContainText(
      "Marketplace profile: published",
    );
    await page.getByLabel("Title").fill(offerTitle);
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

  test("Guardian sees current terms, claims the exact offer, and sees Pending activity", async ({
    page,
  }) => {
    await signIn(page, "guardian-a@example.invalid", "Demo-only-Guardian-A!");
    await page.goto("/marketplace");
    const card = page.locator(".offerCard", { hasText: offerTitle });
    await expect(card).toBeVisible();
    await card.getByRole("link", { name: "See offer and eligibility" }).click();
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

    await page.goto("/dashboard");
    const timelineItem = page.locator(".guardianTimelineItem", {
      hasText: offerTitle,
    });
    await expect(timelineItem).toBeVisible();
    await expect(
      timelineItem.getByText("Pending", { exact: true }),
    ).toBeVisible();
  });

  test("Partner captures candidate savings context, confirms once, replay fails safely, and Guardian sees Redeemed", async ({
    page,
  }) => {
    await signIn(page, "partner-admin@example.invalid", "Demo-only-Partner!");
    await page.goto(`/redeem/${redeemCode}`);
    await expect(page.getByRole("heading", { name: offerTitle })).toBeVisible();
    await expect(page.getByText("Valid claim")).toBeVisible();

    await page.getByLabel("Reference/list value in minor units").fill("2500");
    await page.getByLabel("Amount actually paid in minor units").fill("1800");
    await page.getByLabel("Currency code").fill("usd");
    await page.getByLabel("Reference value type").selectOption("retail_price");
    await page.getByLabel("Reference source").selectOption("receipt");
    await page.getByLabel("Evidence/reference note").fill("qa-receipt-ui-001");
    await page
      .getByLabel("Partner customer attestation")
      .selectOption("new_to_business");

    await page.getByRole("button", { name: "Confirm utilization" }).click();
    const status = page.getByRole("status");
    await expect(status).toContainText("Utilization confirmed");
    await expect(status).toContainText("not a verified savings total");
    const statusText = (await status.textContent()) || "";
    const redemptionId = statusText.match(
      /Record ([0-9a-f]{8}-[0-9a-f-]{27,})\./i,
    )?.[1];
    expect(redemptionId).toBeTruthy();

    const supabaseUrl = process.env.PLAYWRIGHT_SUPABASE_URL;
    const supabaseKey = process.env.PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY;
    expect(supabaseUrl).toBeTruthy();
    expect(supabaseKey).toBeTruthy();
    const partnerDb = createClient(supabaseUrl!, supabaseKey!);
    const signInResult = await partnerDb.auth.signInWithPassword({
      email: "partner-admin@example.invalid",
      password: "Demo-only-Partner!",
    });
    expect(signInResult.error).toBeNull();
    const { data: captured, error: capturedError } = await partnerDb
      .from("redemptions")
      .select(
        "retail_amount_minor,paid_amount_minor,candidate_savings_minor,currency_code,reference_value_kind,reference_value_source,evidence_reference,partner_customer_attestation",
      )
      .eq("id", redemptionId!)
      .single();
    expect(capturedError).toBeNull();
    expect(captured).toMatchObject({
      retail_amount_minor: 2500,
      paid_amount_minor: 1800,
      candidate_savings_minor: 700,
      currency_code: "USD",
      reference_value_kind: "retail_price",
      reference_value_source: "receipt",
      evidence_reference: "qa-receipt-ui-001",
      partner_customer_attestation: "new_to_business",
    });

    await page.getByLabel("Manual redemption code").fill(redeemCode);
    await page.getByRole("button", { name: "Validate code" }).click();
    await expect(page.getByRole("status")).toContainText(
      "invalid, expired, used, or belongs to another Partner",
    );

    await signIn(page, "guardian-a@example.invalid", "Demo-only-Guardian-A!");
    const timelineItem = page.locator(".guardianTimelineItem", {
      hasText: offerTitle,
    });
    await expect(timelineItem).toBeVisible();
    await expect(
      timelineItem.getByText("Redeemed", { exact: true }),
    ).toBeVisible();
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
