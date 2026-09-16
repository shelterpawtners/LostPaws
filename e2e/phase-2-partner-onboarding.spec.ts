import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

const supabaseUrl = process.env.PLAYWRIGHT_SUPABASE_URL || "";
const publishableKey = process.env.PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY || "";
const hasLocalSupabase = Boolean(publishableKey);

async function clearPriorCandidateDismissals() {
  if (!supabaseUrl || !publishableKey) return;

  const qa = createClient(supabaseUrl, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: signIn, error: signInError } = await qa.auth.signInWithPassword(
    {
      email: "partner-b@example.invalid",
      password: "Demo-only-Partner-B!",
    },
  );
  expect(signInError).toBeNull();
  expect(signIn.user?.id).toBeTruthy();

  const { data: draft, error: draftError } = await qa
    .from("organization_onboarding_drafts")
    .select("id")
    .eq("created_by", signIn.user!.id)
    .maybeSingle();
  expect(draftError).toBeNull();

  if (draft?.id) {
    const { error: deleteError } = await qa
      .from("organization_candidate_dismissals")
      .delete()
      .eq("draft_id", draft.id);
    expect(deleteError).toBeNull();
  }

  await qa.auth.signOut();
}

test.describe("Phase 2 checkpoint 1 partner organization onboarding", () => {
  test.skip(!hasLocalSupabase, "Local Supabase publishable key is required");

  test("keeps entry-first details, surfaces a match, and offers safe next actions", async ({
    page,
  }) => {
    // Shared-dev acceptance reruns intentionally reuse the seeded Partner B
    // account. This test persists a "Not my business" dismissal at the end,
    // so reset only that QA user's prior dismissal through normal RLS first.
    await clearPriorCandidateDismissals();

    await page.goto("/login");
    await page.getByLabel("Email address").fill("partner-b@example.invalid");
    await page
      .getByLabel("Password", { exact: true })
      .fill("Demo-only-Partner-B!");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto("/onboarding/petbiz");
    await expect(
      page.getByRole("heading", { name: "Start with your business details." }),
    ).toBeVisible();
    await page.getByLabel("Public business name").fill("Demo PetBiz A");
    await expect(
      page.getByRole("heading", { name: "Possible matches" }),
    ).toBeVisible();
    await expect(page.getByText("Demo PetBiz A").last()).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Request access" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Claim review" }),
    ).toBeVisible();
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Not my business" }).click();
    await expect(page.getByText("Marked as not my business")).toBeVisible();
    await expect(page.getByLabel("Public business name")).toHaveValue(
      "Demo PetBiz A",
    );
  });

  test("a returning vendor with an existing organization is offered manage actions, not onboarding, and stays on the same organization", async ({
    page,
  }) => {
    await page.goto("/login");
    await page
      .getByLabel("Email address")
      .fill("partner-admin@example.invalid");
    await page
      .getByLabel("Password", { exact: true })
      .fill("Demo-only-Partner!");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL(/\/dashboard$/);

    await expect(
      page.getByRole("link", { name: /Manage business profile/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Complete your organization/ }),
    ).toHaveCount(0);

    await page.getByRole("link", { name: /Manage business profile/ }).click();
    await expect(page).toHaveURL(/\/business$/);
    await expect(page.getByLabel("Organization")).not.toHaveValue("");
    const organizationId = await page.getByLabel("Organization").inputValue();

    await page.goto("/dashboard");
    await page.reload();
    await expect(
      page.getByRole("link", { name: /Manage business profile/ }),
    ).toBeVisible();
    await page.getByRole("link", { name: /Manage business profile/ }).click();
    await expect(page.getByLabel("Organization")).toHaveValue(organizationId);
  });

  test("with multiple organizations, /business and /partner/offers agree on the same default and stay in sync when switched", async ({
    page,
  }) => {
    // Uses rave-vendor@example.invalid specifically: it is not touched by
    // any other test's organization_onboarding_drafts row in this file or
    // in phase-2-offer-redemption.spec.ts (which shares that same
    // one-row-per-user table for partner-admin). Both files run in the same
    // CI command in parallel workers -- reusing a persona's draft row
    // across them caused a real "Cannot read properties of null" race here.
    const supabaseUrl = process.env.PLAYWRIGHT_SUPABASE_URL!;
    const supabaseKey = process.env.PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY!;
    const partnerDb = createClient(supabaseUrl, supabaseKey);
    const signInResult = await partnerDb.auth.signInWithPassword({
      email: "rave-vendor@example.invalid",
      password: "Demo-only-RAVE-Vendor!",
    });
    const userId = signInResult.data.user!.id;
    const secondOrgName = `Second real org ${Date.now()}`;
    const { data: draft } = await partnerDb
      .from("organization_onboarding_drafts")
      .upsert(
        {
          created_by: userId,
          partner_kind: "rave_vendor",
          form_data: {
            name: secondOrgName,
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
    const { data: secondOrgId } = await partnerDb.rpc(
      "create_partner_organization",
      {
        p_partner_kind: "rave_vendor",
        p_form: {
          name: secondOrgName,
          relationship: "independent",
          additionalLocations: [],
        },
        p_draft_id: draft!.id,
      },
    );

    await page.goto("/login");
    await page.getByLabel("Email address").fill("rave-vendor@example.invalid");
    await page
      .getByLabel("Password", { exact: true })
      .fill("Demo-only-RAVE-Vendor!");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL(/\/dashboard$/);

    await page.goto("/business");
    const businessOrgSelect = page.getByLabel("Organization");
    await expect(businessOrgSelect).not.toHaveValue("", { timeout: 15_000 });
    const defaultOnBusiness = await businessOrgSelect.inputValue();

    await page.goto("/partner/offers");
    const offersOrgSelect = page
      .locator(".rolePanel")
      .getByLabel("Organization");
    await expect(offersOrgSelect).not.toHaveValue("", { timeout: 15_000 });
    await expect(offersOrgSelect).toHaveValue(defaultOnBusiness);

    await offersOrgSelect.selectOption(secondOrgId as string);
    await page.goto("/business");
    await expect(businessOrgSelect).toHaveValue(secondOrgId as string);
  });
});
