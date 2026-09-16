import { createClient } from "@supabase/supabase-js";
import { expect, test, type Page } from "@playwright/test";

// Issue #283 P1 recovery: the real hosted owner offer got stuck at
// channel=pet with no event even after the vendor switched it to Human/RAVE
// and attached the Lost Lands event, because revise_partner_offer silently
// dropped the channel field on every edit. This regression exercises the
// exact edit path that broke: an existing offer, revised (not just
// created), switching channel and attaching an event.
//
// Uses a freshly signed-up vendor per run (not a shared seeded persona), same
// isolation reasoning as issue-283-media-upload.spec.ts.
const runSuffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const vendorEmail = `channel-persist-vendor-${runSuffix}@example.invalid`;
const vendorPassword = "Audit-only-Password9!";
const orgName = `Playwright Channel Vendor ${runSuffix}`;
const offerTitle = `Playwright channel persistence offer ${runSuffix}`;
const eventTitle = `Playwright Lost Lands ${runSuffix}`;

test.describe.serial("Issue #283 P1 offer channel + event persistence", () => {
  test.beforeAll(async () => {
    const supabaseUrl = process.env.PLAYWRIGHT_SUPABASE_URL;
    const supabaseKey = process.env.PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY;
    expect(supabaseUrl).toBeTruthy();
    expect(supabaseKey).toBeTruthy();

    const vendorDb = createClient(supabaseUrl!, supabaseKey!);
    const signUpResult = await vendorDb.auth.signUp({
      email: vendorEmail,
      password: vendorPassword,
    });
    expect(signUpResult.error).toBeNull();
    const userId = signUpResult.data.user?.id;
    expect(userId).toBeTruthy();

    const { data: draft, error: draftError } = await vendorDb
      .from("organization_onboarding_drafts")
      .upsert(
        {
          created_by: userId!,
          partner_kind: "petbiz",
          form_data: {
            name: orgName,
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
      await vendorDb.rpc("create_partner_organization", {
        p_partner_kind: "petbiz",
        p_form: {
          name: orgName,
          relationship: "independent",
          additionalLocations: [],
        },
        p_draft_id: draft!.id,
      });
    expect(organizationError).toBeNull();
    expect(organizationId).toBeTruthy();
  });

  async function signIn(page: Page) {
    await page.goto("/login");
    await page.getByLabel("Email address").fill(vendorEmail);
    await page.getByLabel("Password", { exact: true }).fill(vendorPassword);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  }

  test("switching an existing offer to Human/RAVE and attaching an event persists both, and both surface publicly", async ({
    page,
  }) => {
    await signIn(page);

    // Create and publish the event first -- the offer form's event dropdown
    // only lists already-published events.
    await page.goto("/events");
    await page.getByRole("button", { name: /Add an event/ }).click();
    await page.getByLabel("Title").fill(eventTitle);
    await page
      .getByLabel("Summary")
      .fill("A regression check event for offer channel persistence.");
    await page.getByRole("button", { name: "Save event" }).click();
    await expect(page.getByText(/Saved as a draft/)).toBeVisible();
    const draftItem = page.locator(".evDrafts li", { hasText: eventTitle });
    await expect(draftItem).toBeVisible();
    await draftItem.getByRole("button", { name: "Publish" }).click();
    await expect(page.getByText(/Published\. It now appears/)).toBeVisible();

    // Create the offer as a plain Pet offer -- the real hosted bug only
    // reproduces on a *revise* of an already-existing offer, not on create.
    await page.goto("/partner/offers");
    const offerOrganization = page
      .locator("aside.rolePanel")
      .getByRole("combobox")
      .first();
    await expect(offerOrganization).toContainText(orgName, {
      timeout: 15_000,
    });
    await expect(page.getByLabel("Offer audience")).toHaveValue("pet");
    await page.getByLabel("Title").fill(offerTitle);
    await page
      .getByLabel("Deal / description")
      .fill("Starts as a Pet offer, then switches to Human/RAVE.");
    await page.getByLabel("Terms and conditions").fill("Demo only.");
    await page
      .getByLabel("How customers use it")
      .fill("Show the private code at checkout.");
    await page.getByRole("button", { name: "Save new version" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Saved as a new draft version",
    );

    // Now revise it: switch to Human/RAVE and attach the event. This is the
    // exact edit that silently lost the channel change before this fix.
    await page.getByLabel("Offer audience").selectOption("rave");
    await page
      .getByLabel("Feature this offer at an event (optional)")
      .selectOption({ label: eventTitle });
    await expect(page.getByLabel("How customers use it")).toHaveCount(0);
    await page.getByLabel("Offer audience").selectOption("pet");
    await expect(page.getByLabel("How customers use it")).toHaveValue(
      "Show the private code at checkout.",
    );
    await page.getByLabel("Offer audience").selectOption("rave");
    await expect(page.getByLabel("How customers use it")).toHaveCount(0);
    await page.getByRole("button", { name: "Save new version" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Saved as a new draft version",
    );

    // Reload and re-select from the list -- confirm the channel and event
    // attachment both came back from the database, not just local state.
    await page.reload();
    await offerOrganization.selectOption({ label: orgName });
    await page.getByRole("button", { name: new RegExp(offerTitle) }).click();
    await expect(page.getByLabel("Title")).toHaveValue(offerTitle);
    await expect(page.getByLabel("Offer audience")).toHaveValue("rave");
    await expect(
      page.getByLabel("Feature this offer at an event (optional)"),
    ).toHaveValue(/.+/);
    const eventValue = await page
      .getByLabel("Feature this offer at an event (optional)")
      .inputValue();
    expect(eventValue).not.toBe("");

    await page.getByRole("button", { name: "Publish or schedule" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Published. Now visible in Marketplace.",
    );

    // Publicly visible under the RAVE channel filter (not just the
    // unfiltered Marketplace, which every offer would pass regardless of
    // the bug).
    await page.goto("/marketplace?channel=rave");
    await expect(
      page.locator(".offerCard", { hasText: offerTitle }),
    ).toBeVisible();

    // And on the attached event's own detail page.
    await page.goto(`/marketplace?event=${eventValue}`);
    await expect(
      page.locator(".offerCard", { hasText: offerTitle }),
    ).toBeVisible();
  });
});
