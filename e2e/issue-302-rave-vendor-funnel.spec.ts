import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

const runSuffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const email = `issue-302-rave-${runSuffix}@example.invalid`;
const password = "Issue-302-RAVE-Password9!";

test.describe.serial("Issue #302 LostPaws RAVE vendor acquisition", () => {
  test("keeps signed-out visitors on RAVE registration", async ({ page }) => {
    await page.goto("/lostpaws");
    await expect(
      page.getByRole("link", { name: "Join as a vendor" }).first(),
    ).toHaveAttribute("href", "/register?type=rave_vendor");
  });

  test("bootstraps a fresh RAVE vendor and routes their signed-in CTA to onboarding", async ({
    page,
  }) => {
    const supabaseUrl = process.env.PLAYWRIGHT_SUPABASE_URL;
    const supabaseKey = process.env.PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY;
    expect(supabaseUrl).toBeTruthy();
    expect(supabaseKey).toBeTruthy();

    const vendorDb = createClient(supabaseUrl!, supabaseKey!);
    const signUp = await vendorDb.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: "Issue 302 RAVE vendor",
          onboarding_type: "rave_vendor",
        },
      },
    });
    expect(signUp.error).toBeNull();
    const userId = signUp.data.user?.id;
    expect(userId).toBeTruthy();

    const [{ data: profile }, { data: participants }, { data: roles }] =
      await Promise.all([
        vendorDb.from("profiles").select("id").eq("id", userId!).maybeSingle(),
        vendorDb
          .from("participant_roles")
          .select("participant_type")
          .eq("user_id", userId!)
          .eq("participant_type", "rave_vendor"),
        vendorDb
          .from("user_roles")
          .select("role_code")
          .eq("user_id", userId!)
          .eq("role_code", "partner_member")
          .is("revoked_at", null),
      ]);
    expect(profile?.id).toBe(userId);
    expect(participants).toHaveLength(1);
    expect(roles).toHaveLength(1);

    await page.goto("/login");
    await page.getByLabel("Email address").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto("/lostpaws");
    await expect(
      page.getByRole("link", { name: "Join as a vendor" }).first(),
    ).toHaveAttribute("href", "/onboarding/rave_vendor");
  });
});
