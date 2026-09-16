import { createClient } from "@supabase/supabase-js";
import { expect, test, type Page } from "@playwright/test";

// Uses a freshly signed-up vendor per run (not a shared seeded persona) so
// this file cannot race phase-2-offer-redemption.spec.ts or
// phase-2-partner-onboarding.spec.ts over the one-row-per-user
// organization_onboarding_drafts table when CI runs spec files in parallel
// workers -- see phase-2-partner-onboarding.spec.ts's own comment about that
// exact collision.
const runSuffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const vendorEmail = `media-upload-vendor-${runSuffix}@example.invalid`;
const vendorPassword = "Audit-only-Password9!";
const orgName = `Playwright Media Vendor ${runSuffix}`;
const offerTitle = `Playwright cover photo offer ${runSuffix}`;

const onePixelPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6nWQAAAAASUVORK5CYII=",
  "base64",
);

test.describe.serial("Issue #283 P1-D offer cover photo upload", () => {
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

  test("uploaded cover photo survives reload and renders on the public offer page", async ({
    page,
  }) => {
    await signIn(page);
    await page.goto("/partner/offers");
    const offerOrganization = page
      .locator("aside.rolePanel")
      .getByRole("combobox")
      .first();
    await expect(offerOrganization).toContainText(orgName, {
      timeout: 15_000,
    });

    await page.getByLabel("Title").fill(offerTitle);
    await page
      .getByLabel("Short description")
      .fill("A test-only offer for the cover photo regression.");
    await page.getByLabel("Terms and conditions").fill("Demo only.");
    await page
      .getByLabel("How customers use it")
      .fill("Show the private code at checkout.");

    // Cover photo starts disabled until the offer has a real id.
    await expect(page.getByLabel("Cover photo")).toBeDisabled();

    await page.getByRole("button", { name: "Save new version" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Saved as a new draft version",
    );

    const coverInput = page.getByLabel("Cover photo");
    await expect(coverInput).toBeEnabled({ timeout: 15_000 });
    await coverInput.setInputFiles({
      name: "cover.png",
      mimeType: "image/png",
      buffer: onePixelPng,
    });
    // Issue #283 P1 recovery: the upload attaches image_path to the offer
    // row immediately after the Storage write succeeds, via
    // set_partner_offer_image_path -- it no longer waits on a later manual
    // Save. A vendor who uploads and then navigates away (or whose next
    // save fails) must not end up with an orphaned Storage object and a
    // null image_path, which is exactly what happened to the real hosted
    // owner offer that prompted this fix.
    await expect(page.getByText("Photo uploaded and attached.")).toBeVisible({
      timeout: 15_000,
    });
    const preview = page.locator(".mediaUploadPreview");
    await expect(preview).toBeVisible();
    const uploadedSrc = await preview.getAttribute("src");
    expect(uploadedSrc).toContain("event-offer-media");

    // Reload, re-select the offer from the list (selection is in-memory
    // state, not persisted), and confirm the photo path came back from the
    // database rather than only surviving in local component state --
    // deliberately without an intervening manual Save.
    await page.reload();
    await page.getByRole("button", { name: new RegExp(offerTitle) }).click();
    await expect(page.getByLabel("Title")).toHaveValue(offerTitle);
    await expect(page.locator(".mediaUploadPreview")).toHaveAttribute(
      "src",
      uploadedSrc!,
      { timeout: 15_000 },
    );

    await page.getByRole("button", { name: "Publish or schedule" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Published. Now visible in Marketplace.",
    );
    await page.getByRole("link", { name: "View in Marketplace" }).click();
    await expect(page).toHaveURL(/\/offers\//);
    await expect(page.locator(".marketOfferPhoto")).toHaveAttribute(
      "src",
      uploadedSrc!,
      { timeout: 15_000 },
    );
  });
});
