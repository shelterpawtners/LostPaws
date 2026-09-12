import { expect, test, type Page } from "@playwright/test";

const guardianA = {
  email: "guardian-a@example.invalid",
  password: "Demo-only-Guardian-A!",
};
const guardianB = {
  email: "guardian-b@example.invalid",
  password: "Demo-only-Guardian-B!",
};
const petAId = "30000000-0000-0000-0000-000000000001";
const avatarPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQ2sAAAAASUVORK5CYII=",
  "base64",
);

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

async function signOut(page: Page) {
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/$/);
}

test.describe.serial("Phase 3 Guardian Passport foundation", () => {
  test("Guardian private profile-lite and avatar persist and reload", async ({
    page,
  }) => {
    await signIn(page, guardianA.email, guardianA.password);

    const profilePanel = page
      .getByRole("heading", { name: "Your Guardian details" })
      .locator("..");
    await expect(
      profilePanel.getByRole("heading", { name: "Your Guardian details" }),
    ).toBeVisible();
    await profilePanel.getByLabel("Full name").fill("Guardian A Phase 3");
    await profilePanel.getByLabel("Phone").fill("248-555-0101");
    await profilePanel.getByLabel("Instagram").fill("@guardian_a_qa");
    await profilePanel
      .getByRole("button", { name: "Save private profile" })
      .click();
    await expect(profilePanel.getByRole("status")).toContainText(
      "Private profile saved",
    );

    await profilePanel.getByLabel("Choose profile photo").setInputFiles({
      name: "guardian-avatar.png",
      mimeType: "image/png",
      buffer: avatarPng,
    });
    await expect(profilePanel.getByRole("status")).toContainText(
      "Profile photo updated",
    );
    await expect(
      profilePanel.getByRole("img", { name: "Guardian A Phase 3 profile" }),
    ).toBeVisible();

    await page.reload();
    const reloadedProfilePanel = page
      .getByRole("heading", { name: "Your Guardian details" })
      .locator("..");
    await expect(reloadedProfilePanel.getByLabel("Full name")).toHaveValue(
      "Guardian A Phase 3",
    );
    await expect(reloadedProfilePanel.getByLabel("Phone")).toHaveValue(
      "248-555-0101",
    );
    await expect(reloadedProfilePanel.getByLabel("Instagram")).toHaveValue(
      "@guardian_a_qa",
    );
    await expect(
      reloadedProfilePanel.getByRole("img", {
        name: "Guardian A Phase 3 profile",
      }),
    ).toBeVisible();
  });

  test("primary Guardian edits and reloads Passport basics", async ({
    page,
  }) => {
    await signIn(page, guardianA.email, guardianA.password);
    await page.goto(`/pets/${petAId}`);

    // The heading's immediate parent is .passportLeadCopy, while "Private by
    // default" sits in its sibling .passportLeadMeta, so scope to the shared
    // .passportLead panel. PR #78 ("photo-first experience") introduced that
    // split and this assertion had been failing ever since.
    const passportIntro = page.locator(".passportLead");
    const passportForm = page
      .getByRole("heading", { name: "Passport basics" })
      .locator("..");
    await expect(
      passportIntro.getByRole("heading", { name: "Demo Pet A" }),
    ).toBeVisible();
    await expect(passportIntro.getByText("Private by default")).toBeVisible();
    await passportForm.getByLabel("Breed").fill("Phase 3 Labrador mix");
    await passportForm.getByLabel("Birth date").fill("2021-05-10");
    await passportForm
      .getByLabel("Spay/neuter status")
      .selectOption("neutered");
    await passportForm
      .getByRole("button", { name: "Save Passport basics" })
      .click();
    await expect(passportForm.getByRole("status")).toContainText(
      "Passport basics saved",
    );

    await page.reload();
    const reloadedPassportForm = page
      .getByRole("heading", { name: "Passport basics" })
      .locator("..");
    await expect(reloadedPassportForm.getByLabel("Breed")).toHaveValue(
      "Phase 3 Labrador mix",
    );
    await expect(reloadedPassportForm.getByLabel("Birth date")).toHaveValue(
      "2021-05-10",
    );
    await expect(
      reloadedPassportForm.getByLabel("Spay/neuter status"),
    ).toHaveValue("neutered");

    await page.getByRole("link", { name: "Back to your pets" }).click();
    await expect(page.getByText("Phase 3 Labrador mix")).toBeVisible();
  });

  test("another Guardian cannot open or edit the pet Passport", async ({
    page,
  }) => {
    await signIn(page, guardianA.email, guardianA.password);
    await signOut(page);
    await signIn(page, guardianB.email, guardianB.password);
    await page.goto(`/pets/${petAId}`);

    await expect(
      page.getByRole("heading", { name: "Pet unavailable" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Save Passport basics" }),
    ).toHaveCount(0);
  });
});
