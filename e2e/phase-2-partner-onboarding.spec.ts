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
    await page.getByLabel("Password").fill("Demo-only-Partner-B!");
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
    await page.getByRole("button", { name: "Not my business" }).click();
    await expect(page.getByText("Marked as not my business")).toBeVisible();
    await expect(page.getByLabel("Public business name")).toHaveValue(
      "Demo PetBiz A",
    );
  });
});
