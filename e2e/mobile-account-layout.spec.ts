import { expect, test, type Page } from "@playwright/test";

const publishableKey = process.env.PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY || "";
const hasLocalSupabase = Boolean(publishableKey);

const viewports = [
  { name: "360x740", width: 360, height: 740 },
  { name: "390x844", width: 390, height: 844 },
] as const;

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflows, "document must not overflow the viewport width").toBe(
    false,
  );
}

// Confirms the nav/picker panel sits above the main content panel -- a
// single stacked column, not a sidebar-and-content row -- by comparing their
// vertical positions rather than asserting any specific CSS.
async function expectNavAboveContent(
  page: Page,
  navSelector: string,
  contentSelector: string,
) {
  const navBox = await page.locator(navSelector).boundingBox();
  const contentBox = await page.locator(contentSelector).boundingBox();
  expect(navBox, `${navSelector} must be visible and measurable`).not
    .toBeNull();
  expect(contentBox, `${contentSelector} must be visible and measurable`)
    .not.toBeNull();
  expect(
    navBox!.y + navBox!.height,
    `${navSelector} must sit above ${contentSelector} (single column)`,
  ).toBeLessThanOrEqual(contentBox!.y);
}

// The header's hamburger toggle is a native <button>: the browser already
// gives it Enter/Space activation, so this only confirms that behavior keeps
// working for the shared Header across both account surfaces.
async function expectNavMenuKeyboardAccessible(page: Page) {
  const toggle = page.getByRole("button", { name: "Open menu" });
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(nav).toBeHidden();
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(nav).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close menu" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(nav).toBeHidden();
}

test.describe("Mobile account layout", () => {
  test.skip(!hasLocalSupabase, "Local Supabase publishable key is required");

  for (const viewport of viewports) {
    test(`Guardian dashboard is single-column and keyboard-operable at ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await signIn(
        page,
        "guardian-a@example.invalid",
        "Demo-only-Guardian-A!",
      );
      await page.goto("/dashboard");
      await expect(page.locator(".accountSectionNav")).toBeVisible();

      await expectNoHorizontalOverflow(page);
      await expectNavAboveContent(page, ".dashboardRoleNav", ".dashboardMain");
      await expectNavMenuKeyboardAccessible(page);
    });

    test(`Partner offers page is single-column and keyboard-operable at ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await signIn(
        page,
        "partner-admin@example.invalid",
        "Demo-only-Partner!",
      );
      await page.goto("/partner/offers");
      await expect(
        page.getByRole("heading", { name: "Create a new offer" }),
      ).toBeVisible();

      await expectNoHorizontalOverflow(page);
      await expectNavAboveContent(page, ".offerTopBar", ".offerEditorPanel");
      await expectNavMenuKeyboardAccessible(page);
    });
  }
});
