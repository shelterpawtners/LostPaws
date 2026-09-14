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

test("Guardian manages a five-photo Passport gallery", async ({ page }) => {
  await signIn(page);
  await page.goto(`/pets/${petId}`);
  await expect(
    page.getByRole("heading", { name: "Passport gallery" }),
  ).toBeVisible();
  await expect(page.locator(".petMediaPanel")).toBeVisible();
  await expect(page.locator(".passportBasicsPanel")).toBeVisible();

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles([
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

  await fileInput.setInputFiles([
    { name: "passport-three.png", mimeType: "image/png", buffer: onePixelPng },
    { name: "passport-four.png", mimeType: "image/png", buffer: onePixelPng },
    { name: "passport-five.png", mimeType: "image/png", buffer: onePixelPng },
  ]);
  await expect(cards).toHaveCount(5, { timeout: 15_000 });
  await expect(page.getByText("5 photo limit reached")).toBeVisible();
  await expect(fileInput).toBeDisabled();

  await cards.nth(4).getByRole("button", { name: "Remove photo 5" }).click();
  await expect(cards).toHaveCount(4, { timeout: 15_000 });
  await expect(page.getByText("Add photos (1 left)")).toBeVisible();
  await expect(fileInput).toBeEnabled();

  const layout = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
});

// Issue #156: on some mobile browsers the OS photo/camera picker returns one
// image per pick rather than a multi-select FileList, even though the same
// <input multiple> works as a batch on desktop. This drives the input the
// same way that picker would — one setInputFiles call per photo, at a phone
// viewport — to prove the gallery accumulates rather than replacing the
// prior photo. Registers its own guardian/pet rather than reusing the
// shared demo pet so it cannot race the batch-upload test above.
test("accumulates photos added one at a time on a phone viewport", async ({
  page,
}) => {
  // Failed twice in CI at the default/slow-multiplied budget with the
  // gallery locator resolving to 0 elements for the full wait window (not a
  // brief delay) — consistent with CI resource contention on a shared
  // runner rather than a real accumulate-vs-replace regression, which was
  // independently verified live against a real backend before this test was
  // added (see the PR history for issue #156). Set an explicit, generous
  // overall budget rather than relying on test.slow()'s 3x multiplier.
  test.setTimeout(150_000);
  await page.setViewportSize({ width: 375, height: 900 });
  const email = `mobile-photo-audit-${Date.now()}@example.invalid`;

  await page.goto("/register?type=guardian");
  await page.getByLabel("Full name").fill("Mobile Audit Guardian");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill("Audit-only-Password9!");
  await page.getByLabel(/I agree to the Terms/).check();
  await page.getByRole("button", { name: "Create account" }).click();

  await page.getByLabel("Pet name").fill("Sequential Pup");
  await page.getByLabel("Species").selectOption("dog");
  await page.getByRole("button", { name: "Save and continue" }).click();
  await page.waitForURL(/\/dashboard$/, { timeout: 30_000 });

  await page.getByRole("link", { name: "Open Sequential Pup" }).click();
  await page.waitForURL(/\/pets\//, { timeout: 30_000 });
  // Make sure the gallery has actually mounted (and canEdit has resolved,
  // which is what gates the upload input existing at all) before touching
  // the file input, rather than racing the page's own async ownership check.
  await expect(
    page.getByRole("heading", { name: "Passport gallery" }),
  ).toBeVisible({ timeout: 30_000 });

  const fileInput = page.locator('input[type="file"]');
  const cards = page.getByLabel("Pet photo gallery").locator(".petMediaCard");

  await fileInput.setInputFiles({
    name: "one-at-a-time-1.png",
    mimeType: "image/png",
    buffer: onePixelPng,
  });
  await expect(cards).toHaveCount(1, { timeout: 60_000 });

  await fileInput.setInputFiles({
    name: "one-at-a-time-2.png",
    mimeType: "image/png",
    buffer: onePixelPng,
  });
  await expect(cards).toHaveCount(2, { timeout: 60_000 });

  const layout = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
});
