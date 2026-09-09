import { expect, test, type Page } from "@playwright/test";
import {
  expectRuntimeClean,
  freshSignedInPage,
  issue5Hosted,
  requiredSetting,
  signedInClient,
  signInPage,
  signOutPage,
  watchRuntime,
} from "./helpers/issue5";

const runSuffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const guardianEmail = () => requiredSetting("PLAYWRIGHT_GUARDIAN_EMAIL");
const guardianPassword = () => requiredSetting("PLAYWRIGHT_GUARDIAN_PASSWORD");
const partnerEmail = () => requiredSetting("PLAYWRIGHT_PARTNER_EMAIL");
const partnerPassword = () => requiredSetting("PLAYWRIGHT_PARTNER_PASSWORD");
const adminEmail = () => requiredSetting("PLAYWRIGHT_ADMIN_EMAIL");
const adminPassword = () => requiredSetting("PLAYWRIGHT_ADMIN_PASSWORD");

async function createGuardianPet(page: Page, name: string, species: string) {
  await page.goto("/onboarding/guardian");
  await page.getByLabel("Pet name").fill(name);
  await page.getByLabel("Species").selectOption(species);
  await page.getByRole("button", { name: "Save and continue" }).click();
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 20_000 });
  await expect(page.getByRole("link", { name: `Open ${name}` })).toBeVisible();
}

async function createPartnerOffer(page: Page, title: string) {
  await page.getByRole("button", { name: "New offer" }).click();
  await page.getByLabel("Title").fill(title);
  await page
    .getByLabel("Short description")
    .fill(`Issue 5 multi-offer persistence ${runSuffix}`);
  await page
    .getByLabel("Terms and conditions")
    .fill(`Issue 5 terms ${runSuffix}`);
  await page
    .getByLabel("How customers use it")
    .fill(`Issue 5 redemption instructions ${runSuffix}`);
  await page.getByLabel("Per-user limit").fill("1");
  await page.getByRole("button", { name: "Save new version" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Saved as a new draft version",
  );
  await page.getByRole("button", { name: "Publish or schedule" }).click();
  await expect(page.getByRole("status")).toContainText("publish complete");
}

function adminQaBanner(page: Page) {
  return page.getByRole("status").filter({ hasText: "ADMIN QA MODE" });
}

test.describe.serial("Issue #5 human-style browser and persistence audit", () => {
  test.skip(!issue5Hosted, "Run through acceptance-gated Hosted QA.");
  test.describe.configure({ timeout: 180_000 });

  test("public routes, aliases, offer details, back/forward, and unknown routes stay coherent", async ({
    page,
  }) => {
    const failures = watchRuntime(page);
    const routes = [
      "/",
      "/rave",
      "/rave-shelter",
      "/passport",
      "/partners",
      "/shelters",
      "/lostpaws",
      "/about",
      "/register",
      "/register?type=guardian",
      "/register?type=shelter",
      "/register?type=petbiz",
      "/register?type=rave_vendor",
      "/login",
      "/forgot-password",
      "/reset-password",
      "/marketplace",
      "/directory",
      "/partners/20000000-0000-0000-0000-000000000001",
    ];

    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status() || 200, route).toBeLessThan(500);
      await expect(page.locator("#main"), route).toBeVisible();
      await expect(page.locator("h1, h2").filter({ visible: true }).first()).toBeVisible();
    }

    await page.goto("/marketplace");
    const firstOffer = page.locator(".offerCard").first();
    await expect(firstOffer).toBeVisible();
    const detailsHref = await firstOffer
      .getByRole("link", { name: "View offer details" })
      .getAttribute("href");
    expect(detailsHref).toMatch(/^\/offers\//);
    await page.goto(detailsHref!);
    await expect(page.getByRole("button", { name: "Claim this offer" })).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/\/marketplace$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/offers\//);

    await page.goto("/sign-in");
    await expect(page).toHaveURL(/\/login$/);
    await page.goto("/sign-up");
    await expect(page).toHaveURL(/\/register$/);
    await page.goto("/register.html");
    await expect(page).toHaveURL(/\/register\?type=guardian&source=business-card$/);
    await page.goto("/this-route-does-not-exist");
    await expect(page).toHaveURL(/\/$/);

    expectRuntimeClean(failures);
  });

  test("Guardian creates multiple canonical pets, reopens them, reloads, signs back in, and reconstructs backend state", async ({
    page,
    browser,
  }) => {
    const email = guardianEmail();
    const password = guardianPassword();
    const db = await signedInClient(email, password);
    const petA = `Issue 5 Dog ${runSuffix}`;
    const petB = `Issue 5 Cat ${runSuffix}`;

    await signInPage(page, email, password);
    await createGuardianPet(page, petA, "dog");
    await createGuardianPet(page, petB, "cat");

    const persistedIds: string[] = [];
    for (const name of [petA, petB]) {
      const { data: pets, error: petError } = await db
        .from("pets")
        .select("id,name")
        .eq("name", name);
      expect(petError).toBeNull();
      expect(pets, `${name} must have one canonical pet row`).toHaveLength(1);
      persistedIds.push(pets![0].id);

      const { data: guardianships, error: guardianshipError } = await db
        .from("guardianships")
        .select("id,pet_id,status,ended_at")
        .eq("pet_id", pets![0].id)
        .eq("status", "active")
        .is("ended_at", null);
      expect(guardianshipError).toBeNull();
      expect(
        guardianships,
        `${name} must have one active guardianship`,
      ).toHaveLength(1);
    }

    await page.goto("/dashboard");
    await expect(page.getByRole("link", { name: `Open ${petA}` })).toBeVisible();
    await expect(page.getByRole("link", { name: `Open ${petB}` })).toBeVisible();
    await expect(page.getByRole("link", { name: "Set up your pet" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Add another pet" })).toBeVisible();

    await page.getByRole("link", { name: `Open ${petA}` }).click();
    await expect(page.getByRole("heading", { name: petA })).toBeVisible();
    await page.getByRole("link", { name: "← Back to your pets" }).click();
    await expect(page.getByRole("link", { name: `Open ${petB}` })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("link", { name: `Open ${petA}` })).toBeVisible();
    await expect(page.getByRole("link", { name: `Open ${petB}` })).toBeVisible();

    await signOutPage(page);
    await page.goto(`/pets/${persistedIds[0]}`);
    await expect(page).toHaveURL(/\/login$/);

    const fresh = await freshSignedInPage(browser, email, password);
    await expect(
      fresh.page.getByRole("link", { name: `Open ${petA}` }),
    ).toBeVisible();
    await expect(
      fresh.page.getByRole("link", { name: `Open ${petB}` }),
    ).toBeVisible();
    await fresh.page.goto(`/pets/${persistedIds[1]}`);
    await expect(fresh.page.getByRole("heading", { name: petB })).toBeVisible();
    await fresh.context.close();
    await db.auth.signOut();
  });

  test("PetBiz profile and multiple published offers survive leave, return, reload, and direct RLS-backed database checks", async ({
    page,
  }) => {
    const email = partnerEmail();
    const password = partnerPassword();
    const db = await signedInClient(email, password);
    const offerA = `Issue 5 Offer A ${runSuffix}`;
    const offerB = `Issue 5 Offer B ${runSuffix}`;

    const { data: membership, error: membershipError } = await db
      .from("organization_memberships")
      .select("organization_id")
      .eq("status", "active")
      .limit(1)
      .maybeSingle();
    expect(membershipError).toBeNull();
    expect(membership?.organization_id).toBeTruthy();
    const organizationId = membership!.organization_id;

    await signInPage(page, email, password);
    await page.goto("/business");
    const saveDraft = page.getByRole("button", { name: "Save draft" });
    await expect(saveDraft).toBeEnabled({ timeout: 15_000 });
    await page
      .getByLabel("Public description")
      .fill(`Issue 5 persisted Partner profile ${runSuffix}`);
    await page.getByLabel("How customers are served").selectOption("online");
    await saveDraft.click();
    await expect(page.getByTestId("partner-profile-save-status")).toContainText(
      "Saved as a private draft.",
    );
    await page.getByRole("button", { name: "Publish profile" }).click();
    await expect(page.getByTestId("partner-profile-save-status")).toContainText(
      "Published.",
    );

    await page.goto("/partner/offers");
    await expect(page.getByTestId("marketplace-profile-state")).toContainText(
      "published",
    );
    await createPartnerOffer(page, offerA);
    await createPartnerOffer(page, offerB);

    for (const title of [offerA, offerB]) {
      const { data: offers, error: offerError } = await db
        .from("offers")
        .select("id,title,status,current_version_id")
        .eq("organization_id", organizationId)
        .eq("title", title);
      expect(offerError).toBeNull();
      expect(offers, `${title} must have one canonical offer row`).toHaveLength(1);
      expect(offers![0].current_version_id).toBeTruthy();

      const { data: versions, error: versionError } = await db
        .from("offer_versions")
        .select("id,status")
        .eq("offer_id", offers![0].id);
      expect(versionError).toBeNull();
      expect(versions?.length || 0).toBeGreaterThanOrEqual(1);
    }

    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: "Manage your organization" })).toBeVisible();
    await page.goto("/partner/offers");
    const offerAButton = page.getByRole("button").filter({ hasText: offerA });
    const offerBButton = page.getByRole("button").filter({ hasText: offerB });
    await expect(offerAButton).toBeVisible();
    await expect(offerBButton).toBeVisible();
    await offerAButton.click();
    await expect(page.getByLabel("Title")).toHaveValue(offerA);
    await page.reload();
    await expect(page.getByRole("button").filter({ hasText: offerA })).toBeVisible();
    await expect(page.getByRole("button").filter({ hasText: offerB })).toBeVisible();

    await db.auth.signOut();
  });

  test("Admin QA traverses Shelter and RAVE Vendor current journeys using their real RLS identities", async ({
    page,
  }) => {
    await signInPage(page, adminEmail(), adminPassword());
    await page.goto("/admin-qa");
    await expect(page.getByRole("heading", { name: "Admin QA Mode" })).toBeVisible();

    await page
      .getByRole("button", {
        name: /Act as Shelter Admin, Shelter, Demo Shelter B/,
      })
      .click();
    await expect(adminQaBanner(page)).toContainText("Shelter Admin (Shelter)");
    await expect(
      page.getByRole("heading", { name: "Build your shelter presence" }),
    ).toBeVisible();
    await page.reload();
    await expect(adminQaBanner(page)).toContainText("Shelter Admin (Shelter)");
    await page.goto("/onboarding/shelter");
    await expect(
      page.getByRole("heading", { name: "Tell us about your organization" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Return to Admin" }).click();
    await page.goto("/admin-qa");

    await page
      .getByRole("button", {
        name: /Act as RAVE Vendor, RAVE Vendor, Demo RAVE Vendor/,
      })
      .click();
    await expect(adminQaBanner(page)).toContainText("RAVE Vendor (RAVE Vendor)");
    await expect(
      page.getByRole("heading", { name: "Manage your organization" }),
    ).toBeVisible();
    await page.goto("/business");
    await expect(page.getByLabel("Organization")).not.toHaveValue("");
    const organizationId = await page.getByLabel("Organization").inputValue();
    await page.reload();
    await expect(page.getByLabel("Organization")).toHaveValue(organizationId);
    await page.getByRole("button", { name: "Return to Admin" }).click();
    await page.goto("/admin-qa");
    await expect(page.getByRole("heading", { name: "Admin QA Mode" })).toBeVisible();
  });

  test("failed Guardian save reports failure, creates no partial row, and succeeds exactly once on retry", async ({
    page,
  }) => {
    const email = guardianEmail();
    const password = guardianPassword();
    const db = await signedInClient(email, password);
    const petName = `Issue 5 Retry Pet ${runSuffix}`;

    await signInPage(page, email, password);
    await page.goto("/onboarding/guardian");
    await page.getByLabel("Pet name").fill(petName);
    await page.getByLabel("Species").selectOption("dog");

    await page.route("**/rest/v1/rpc/save_guardian_onboarding_pet", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Issue 5 simulated save failure" }),
      }),
    );
    await page.getByRole("button", { name: "Save and continue" }).click();
    await expect(page.getByRole("status")).toContainText("Unable to save your pet");
    await expect(page).toHaveURL(/\/onboarding\/guardian$/);

    let result = await db.from("pets").select("id").eq("name", petName);
    expect(result.error).toBeNull();
    expect(result.data).toEqual([]);

    await page.unroute("**/rest/v1/rpc/save_guardian_onboarding_pet");
    await page.getByRole("button", { name: "Save and continue" }).click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 20_000 });
    await expect(page.getByRole("link", { name: `Open ${petName}` })).toBeVisible();

    result = await db.from("pets").select("id").eq("name", petName);
    expect(result.error).toBeNull();
    expect(result.data, "retry must create exactly one pet").toHaveLength(1);

    const { data: guardianships, error } = await db
      .from("guardianships")
      .select("id")
      .eq("pet_id", result.data![0].id)
      .eq("status", "active")
      .is("ended_at", null);
    expect(error).toBeNull();
    expect(guardianships, "retry must create exactly one active guardianship").toHaveLength(1);
    await db.auth.signOut();
  });
});
