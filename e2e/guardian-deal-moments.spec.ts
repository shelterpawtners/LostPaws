import { createClient } from "@supabase/supabase-js";
import { expect, test, type Page } from "@playwright/test";

const runSuffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const offerTitle = `Deal Moment Playwright offer ${runSuffix}`;
const guardianEmail = "guardian-a@example.invalid";
const guardianPassword = "Demo-only-Guardian-A!";
const partnerEmail = "partner-admin@example.invalid";
const partnerPassword = "Demo-only-Partner!";
const partnerOrganizationId = "20000000-0000-0000-0000-000000000001";

const tinyPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAD0lEQVR42mNkYPj/n4GBgQEACfsD/QfKcQAAAABJRU5ErkJggg==",
  "base64",
);

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test("Guardian Deal Moment survives claim to redemption, supports replace, and removes cleanly", async ({
  page,
}) => {
  const supabaseUrl = process.env.PLAYWRIGHT_SUPABASE_URL;
  const supabaseKey = process.env.PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY;
  expect(supabaseUrl).toBeTruthy();
  expect(supabaseKey).toBeTruthy();

  const guardianDb = createClient(supabaseUrl!, supabaseKey!);
  const guardianSignIn = await guardianDb.auth.signInWithPassword({
    email: guardianEmail,
    password: guardianPassword,
  });
  expect(guardianSignIn.error).toBeNull();

  const { data: pets, error: petError } = await guardianDb
    .from("pets")
    .select("id,name")
    .limit(1);
  expect(petError).toBeNull();
  const pet = pets?.[0];
  expect(pet?.id).toBeTruthy();

  const partnerDb = createClient(supabaseUrl!, supabaseKey!);
  const partnerSignIn = await partnerDb.auth.signInWithPassword({
    email: partnerEmail,
    password: partnerPassword,
  });
  expect(partnerSignIn.error).toBeNull();

  const { data: offerId, error: offerError } = await partnerDb.rpc(
    "create_partner_offer",
    {
      p_organization_id: partnerOrganizationId,
      p_terms: {
        title: offerTitle,
        summary: "Deal Moment browser acceptance offer",
        details: "Local browser QA only.",
        terms: "Demo test terms.",
        category: "Grooming",
        eligibility_kind: "all_pets",
        claim_window_days: "30",
        per_user_limit: "1",
        redemption_instructions: "Show the private code.",
        disclosure: "Demo only.",
        applicability: "online",
      },
    },
  );
  expect(offerError).toBeNull();
  expect(offerId).toBeTruthy();

  const { error: publishError } = await partnerDb.rpc("set_partner_offer_state", {
    p_offer_id: offerId,
    p_action: "publish",
  });
  expect(publishError).toBeNull();

  const { data: claimRows, error: claimError } = await guardianDb.rpc(
    "claim_offer",
    { p_offer_id: offerId, p_pet_id: pet!.id },
  );
  expect(claimError).toBeNull();
  const claim = Array.isArray(claimRows) ? claimRows[0] : claimRows;
  expect(claim?.claim_id).toBeTruthy();
  expect(claim?.redeem_code).toBeTruthy();

  await signIn(page, guardianEmail, guardianPassword);
  const timelineItem = page.locator(".guardianTimelineItem", {
    hasText: offerTitle,
  });
  await expect(timelineItem).toBeVisible();
  await expect(timelineItem.getByText("Pending", { exact: true })).toBeVisible();

  const dealMoment = timelineItem.locator(".dealMoment");
  await expect(
    dealMoment.getByText("Show us your pet enjoying the deal"),
  ).toBeVisible();
  await dealMoment.getByLabel(/Caption/).fill("First private Deal Moment");
  await dealMoment.locator('input[type="file"]').setInputFiles({
    name: "first-moment.png",
    mimeType: "image/png",
    buffer: tinyPng,
  });
  await expect(dealMoment.getByRole("status")).toContainText(
    "Deal Moment added.",
    { timeout: 15_000 },
  );
  await expect(dealMoment.locator(".dealMomentImage")).toHaveCount(1);

  await dealMoment.getByLabel(/Caption/).fill("Replacement private Deal Moment");
  await dealMoment.locator('input[type="file"]').setInputFiles({
    name: "replacement-moment.png",
    mimeType: "image/png",
    buffer: tinyPng,
  });
  await expect(dealMoment.getByRole("status")).toContainText(
    "Deal Moment updated.",
    { timeout: 15_000 },
  );
  await expect(dealMoment.locator(".dealMomentImage")).toHaveCount(1);

  const { data: redemptionId, error: redeemError } = await partnerDb.rpc(
    "confirm_redemption",
    {
      p_code: claim.redeem_code,
      p_location_id: null,
      p_attribution: {},
    },
  );
  expect(redeemError).toBeNull();
  expect(redemptionId).toBeTruthy();

  await page.reload();
  const redeemedItem = page.locator(".guardianTimelineItem", {
    hasText: offerTitle,
  });
  await expect(redeemedItem).toBeVisible();
  await expect(
    redeemedItem.getByText("Redeemed", { exact: true }),
  ).toBeVisible();
  const redeemedMoment = redeemedItem.locator(".dealMoment");
  await expect(redeemedMoment.locator(".dealMomentImage")).toHaveCount(1);
  await expect(redeemedMoment.getByLabel(/Caption/)).toHaveValue(
    "Replacement private Deal Moment",
  );

  await redeemedMoment.getByRole("button", { name: "Remove" }).click();
  await expect(redeemedMoment.getByRole("status")).toContainText(
    "Deal Moment removed.",
    { timeout: 15_000 },
  );
  await expect(redeemedMoment.locator(".dealMomentImage")).toHaveCount(0);

  const { count: activeCount, error: activeError } = await guardianDb
    .from("pet_media")
    .select("id", { count: "exact", head: true })
    .eq("claim_id", claim.claim_id)
    .eq("media_context", "deal_moment")
    .eq("status", "active");
  expect(activeError).toBeNull();
  expect(activeCount).toBe(0);
});
