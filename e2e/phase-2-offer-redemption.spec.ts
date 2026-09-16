import { createClient } from "@supabase/supabase-js";
import { expect, test, type Page } from "@playwright/test";

const runSuffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const offerTitle = `Playwright welcome offer ${runSuffix}`;
const journeyOfferTitle = `Playwright persistence check ${runSuffix}`;
const partnerOrganizationName = `Playwright real Partner ${runSuffix}`;

test.describe.serial("Phase 2 offer and redemption journey", () => {
  let redeemCode = "";
  let partnerOrganizationId = "";

  async function signIn(page: Page, email: string, password: string) {
    await page.goto("/login");
    await page.getByLabel("Email address").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
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
    await expect(page.getByTestId("partner-profile-save-status")).toContainText(
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
    await expect(page.getByTestId("partner-profile-save-status")).toContainText(
      "Published.",
    );

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
      .getByLabel("Deal / description")
      .fill("A test-only Partner offer with clear terms.");
    await page
      .getByLabel("Terms and conditions")
      .fill("Demo only. One claim per guardian.");
    await page
      .getByLabel("How customers use it")
      .fill("Show the private code at checkout.");
    await page.getByLabel("Per-user limit").fill("1");

    // Issue #155: a non-https product link is rejected client-side before
    // ever reaching the RPC.
    await page
      .getByLabel("Product / store link")
      .fill("http://insecure.example.com/listing");
    await page.getByRole("button", { name: "Save new version" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Product/store link must be a valid https:// URL",
    );

    await page
      .getByLabel("Product / store link")
      .fill("https://www.etsy.com/listing/123456789/playwright-demo-item");
    await page
      .getByLabel("Product label override")
      .fill("Playwright Demo Enamel Pin");
    await page
      .getByLabel("Call-to-action button text")
      .fill("Shop the Etsy listing");
    await page
      .getByLabel("Product images")
      .fill(
        "https://images.example.invalid/pin-front.jpg\nhttps://images.example.invalid/pin-back.jpg",
      );

    await page.getByRole("button", { name: "Preview" }).click();
    await expect(page.getByText("Preview · all pets")).toBeVisible();
    await page.getByRole("button", { name: "Save new version" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Saved as a new draft version",
    );
    await page.getByRole("button", { name: "Publish or schedule" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Published. Now visible in Marketplace.",
    );
    await expect(
      page.getByRole("link", { name: "View in Marketplace" }),
    ).toBeVisible();
  });

  test("Issue #250: vendor offer survives reload, publishes clearly, appears live in Marketplace, and stays editable", async ({
    page,
  }) => {
    await signIn(page, "partner-admin@example.invalid", "Demo-only-Partner!");
    await page.goto("/partner/offers");
    const offerOrganization = page
      .locator("aside.rolePanel")
      .getByRole("combobox")
      .first();
    await expect(offerOrganization).toContainText(partnerOrganizationName, {
      timeout: 15_000,
    });
    await offerOrganization.selectOption(partnerOrganizationId);

    await page.getByLabel("Title").fill(journeyOfferTitle);
    await page
      .getByLabel("Deal / description")
      .fill("Persistence regression check.");
    await page.getByLabel("Terms and conditions").fill("Demo only.");
    await page
      .getByLabel("How customers use it")
      .fill("Show the code at checkout.");
    await page
      .getByLabel("Product images")
      .fill("https://images.example.invalid/journey-check.jpg");
    const eventSelect = page.getByLabel(
      "Feature this offer at an event (optional)",
    );
    const eventOption = eventSelect
      .locator("option")
      .filter({ hasText: "Demo Saturday Adoption Day" });
    const hasSeededEvent = (await eventOption.count()) > 0;
    let selectedEventId = "";
    if (hasSeededEvent) {
      selectedEventId = (await eventOption.getAttribute("value")) || "";
      await eventSelect.selectOption(selectedEventId);
    }
    await page.getByRole("button", { name: "Save new version" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Saved as a new draft version",
    );

    // The draft must appear immediately, selected, without depending on a
    // second round-trip succeeding.
    const draftButton = page
      .getByRole("button")
      .filter({ hasText: journeyOfferTitle });
    await expect(draftButton).toBeVisible();
    await expect(draftButton).toHaveClass(/active/);

    // Reload: the draft, its image URL, and its event attachment must all
    // still be there and still editable -- not just the title.
    await page.reload();
    await offerOrganization.selectOption(partnerOrganizationId);
    await expect(
      page.getByRole("button").filter({ hasText: journeyOfferTitle }),
    ).toBeVisible();
    await page
      .getByRole("button")
      .filter({ hasText: journeyOfferTitle })
      .click();
    await expect(page.getByLabel("Title")).toHaveValue(journeyOfferTitle);
    await expect(page.getByLabel("Product images")).toHaveValue(
      "https://images.example.invalid/journey-check.jpg",
    );
    if (hasSeededEvent) {
      await expect(
        page.getByLabel("Feature this offer at an event (optional)"),
      ).toHaveValue(selectedEventId);
    }

    // Edit the draft, then publish.
    await page
      .getByLabel("Deal / description")
      .fill("Persistence regression check, revised.");
    await page.getByRole("button", { name: "Save new version" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Saved as a new draft version",
    );
    await page.getByRole("button", { name: "Publish or schedule" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Published. Now visible in Marketplace.",
    );
    const marketplaceLink = page.getByRole("link", {
      name: "View in Marketplace",
    });
    await expect(marketplaceLink).toBeVisible();
    const offerHref = await marketplaceLink.getAttribute("href");
    expect(offerHref).toBeTruthy();

    // The public Marketplace read path must show it live, immediately --
    // no second manual step, no separate sync.
    await page.goto("/marketplace");
    await expect(
      page.locator(".offerCard", { hasText: journeyOfferTitle }),
    ).toBeVisible();

    // The direct "View in Marketplace" link resolves to the live offer.
    await page.goto(offerHref!);
    await expect(page.getByText(journeyOfferTitle).first()).toBeVisible();

    // Event linkage must actually affect the public read path, not just
    // round-trip through the edit form: an event-scoped Marketplace view
    // should surface this offer too.
    if (hasSeededEvent) {
      await page.goto(`/marketplace?event=${selectedEventId}`);
      await expect(
        page.locator(".offerCard", { hasText: journeyOfferTitle }),
      ).toBeVisible();
    }

    // Returning to Offer Manager: still there, still editable/manageable.
    await page.goto("/partner/offers");
    await offerOrganization.selectOption(partnerOrganizationId);
    const publishedButton = page
      .getByRole("button")
      .filter({ hasText: journeyOfferTitle });
    await expect(publishedButton).toBeVisible();
    await expect(publishedButton).toContainText("Published");
    await publishedButton.click();
    await expect(page.getByLabel("Title")).toHaveValue(journeyOfferTitle);

    // Pause must actually remove it from the public Marketplace, and Resume
    // must actually bring it back -- not just toggle a label. Pause is
    // guarded by a window.confirm(), which Playwright auto-dismisses unless
    // told otherwise.
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Pause" }).click();
    await expect(page.getByRole("status")).toContainText("pause complete");
    await expect(publishedButton).toContainText("Paused");
    await page.goto("/marketplace");
    await expect(
      page.locator(".offerCard", { hasText: journeyOfferTitle }),
    ).toHaveCount(0);

    await page.goto("/partner/offers");
    await offerOrganization.selectOption(partnerOrganizationId);
    await publishedButton.click();
    await page.getByRole("button", { name: "Resume" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Published. Now visible in Marketplace.",
    );
    await expect(publishedButton).toContainText("Published");
    await page.goto("/marketplace");
    await expect(
      page.locator(".offerCard", { hasText: journeyOfferTitle }),
    ).toBeVisible();
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

    // Issue #155: the vendor's product link, label, CTA text, and gallery
    // images all render on the public offer detail page.
    await expect(page.getByText("Playwright Demo Enamel Pin")).toBeVisible();
    const shopLink = page.getByRole("link", {
      name: "Shop the Etsy listing",
    });
    await expect(shopLink).toHaveAttribute(
      "href",
      "https://www.etsy.com/listing/123456789/playwright-demo-item",
    );
    await expect(shopLink).toHaveAttribute("target", "_blank");
    await expect(
      page.getByText("ShelterPawtners does not process this purchase"),
    ).toBeVisible();
    const galleryImages = page.locator(".marketOfferGallery img");
    await expect(galleryImages).toHaveCount(2);
    await expect(galleryImages.nth(0)).toHaveAttribute(
      "src",
      "https://images.example.invalid/pin-front.jpg",
    );
    await expect(galleryImages.nth(1)).toHaveAttribute(
      "src",
      "https://images.example.invalid/pin-back.jpg",
    );

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

    page.once("dialog", (dialog) => dialog.accept());
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

  test("attaching an event to an already-published offer clearly warns it is now unpublished, and republishing restores event visibility", async ({
    page,
  }) => {
    // Reproduces the real report: a vendor attaches an event to a LIVE
    // offer via edit, saves, and the association looks like it "failed"
    // because revise_partner_offer points current_version_id at a fresh
    // draft immediately -- the previously published version stops serving
    // right away, with only a generic "Saved as a new draft version"
    // message. The fix is making that consequence explicit; publishing is
    // still a required separate step by design.
    await signIn(page, "partner-admin@example.invalid", "Demo-only-Partner!");
    await page.goto("/partner/offers");
    const offerOrganization = page
      .locator("aside.rolePanel")
      .getByRole("combobox")
      .first();
    await offerOrganization.selectOption(partnerOrganizationId);

    const title = `Playwright event-attach check ${runSuffix}`;
    await page.getByRole("button", { name: "New offer" }).click();
    await page.getByLabel("Title").fill(title);
    await page.getByLabel("Deal / description").fill("Event-attach check.");
    await page.getByLabel("Terms and conditions").fill("Terms.");
    await page.getByLabel("How customers use it").fill("Redemption.");
    await page.getByLabel("Per-user limit").fill("1");
    await page.getByRole("button", { name: "Save new version" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Saved as a new draft version",
    );
    await page.getByRole("button", { name: "Publish or schedule" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Published. Now visible in Marketplace.",
    );

    const eventSelect = page.getByLabel(
      "Feature this offer at an event (optional)",
    );
    const eventOption = eventSelect.locator("option").nth(1);
    const hasSeededEvent = (await eventSelect.locator("option").count()) > 1;
    test.skip(
      !hasSeededEvent,
      "No seeded event available in this environment.",
    );
    const selectedEventId = (await eventOption.getAttribute("value")) || "";
    await eventSelect.selectOption(selectedEventId);
    await page.getByRole("button", { name: "Save new version" }).click();
    await expect(page.getByRole("status")).toContainText(
      "This offer is now unpublished",
    );

    await page.goto(`/events/${selectedEventId}`);
    await expect(page.locator(".offerCard", { hasText: title })).toHaveCount(0);

    await page.goto("/partner/offers");
    await offerOrganization.selectOption(partnerOrganizationId);
    await page.getByRole("button").filter({ hasText: title }).click();
    await expect(eventSelect).toHaveValue(selectedEventId);
    await page.getByRole("button", { name: "Publish or schedule" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Published. Now visible in Marketplace.",
    );

    await page.goto(`/events/${selectedEventId}`);
    await expect(page.locator(".offerCard", { hasText: title })).toBeVisible();
  });
});
