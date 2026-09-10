import { expect, test, type Page } from "@playwright/test";

const petId = "30000000-0000-0000-0000-000000000001";
const onePixelPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6nWQAAAAASUVORK5CYII=",
  "base64",
);

async function signIn(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill("guardian-a@example.invalid");
  await page.getByLabel("Password").fill("Demo-only-Guardian-A!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test("Guardian adds multiple Passport photos, changes primary, and reorders", async ({
  page,
}) => {
  await signIn(page);
  await page.goto(`/pets/${petId}`);
  await expect(
    page.getByRole("heading", { name: "Passport gallery" }),
  ).toBeVisible();

  await page.locator('input[type="file"]').setInputFiles([
    { name: "passport-one.png", mimeType: "image/png", buffer: onePixelPng },
    { name: "passport-two.png", mimeType: "image/png", buffer: onePixelPng },
  ]);

  const gallery = page.getByLabel("Pet photo gallery");
  const cards = gallery.locator(".petMediaCard");
  await expect(cards).toHaveCount(2, { timeout: 15_000 });
  await expect(
    cards.nth(0).getByText("Primary", { exact: true }),
  ).toBeVisible();

  await cards.nth(1).getByRole("button", { name: "Make primary" }).click();
  await expect(
    cards.nth(1).getByText("Primary", { exact: true }),
  ).toBeVisible();

  await cards
    .nth(1)
    .getByRole("button", { name: "Move photo 2 earlier" })
    .click();
  await expect(
    cards.nth(0).getByText("Primary", { exact: true }),
  ).toBeVisible();

  const layout = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
});
