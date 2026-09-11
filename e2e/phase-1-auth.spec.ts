import { expect, test, type Page } from "@playwright/test";

const supabaseUrl =
  process.env.PLAYWRIGHT_SUPABASE_URL ?? "http://127.0.0.1:54321";
const publishableKey = process.env.PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY;

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test.describe("Phase 1 authenticated and protected routes", () => {
  test("redirects an unauthenticated visitor away from protected routes", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
    await expect(
      page.getByRole("heading", { name: "Sign in to ShelterPawtners" }),
    ).toBeVisible();
  });

  test("signs in, exposes the role-aware shell, and opens a protected route", async ({
    page,
  }) => {
    await signIn(page, "partner-admin@example.invalid", "Demo-only-Partner!");

    await expect(
      page.getByRole("heading", { name: "Welcome, Partner Admin" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Partner member" }),
    ).toBeVisible();
    const administrator = page.getByRole("button", {
      name: "Partner administrator",
    });
    await expect(administrator).toBeVisible();
    await administrator.click();
    await expect(page.locator(".dashboardMain .eyebrow")).toHaveText(
      "Partner administrator",
    );

    await page.goto("/business");
    await expect(page).toHaveURL(/\/business$/);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Make your business easy to understand.",
        exact: true,
      }),
    ).toBeVisible();
  });

  test("clears the browser session on logout and protects subsequent access", async ({
    page,
  }) => {
    await signIn(page, "guardian-a@example.invalid", "Demo-only-Guardian-A!");
    await page.getByRole("button", { name: "Sign out" }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
    const storedAuthSessions = await page.evaluate(() =>
      Object.entries(localStorage).filter(
        ([key, value]) =>
          key.startsWith("sb-") && value.includes("access_token"),
      ),
    );
    expect(storedAuthSessions).toEqual([]);

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("Guardian account menu makes Help & feedback a primary entry", async ({
    page,
  }) => {
    await signIn(page, "guardian-a@example.invalid", "Demo-only-Guardian-A!");
    const accountMenu = page.locator(".guardianAccountMenu");

    await accountMenu.locator("summary").click();
    await expect(
      accountMenu.getByRole("button", { name: "Help & feedback" }),
    ).toBeVisible();
    await accountMenu.getByRole("button", { name: "Help & feedback" }).click();
    await expect(
      accountMenu.getByRole("heading", { name: "Help & feedback" }),
    ).toBeVisible();
    await expect(
      accountMenu.getByRole("button", { name: "Close help form" }),
    ).toBeVisible();
  });

  test("denies a guardian access to another guardian's pet through RLS", async ({
    page,
  }) => {
    test.skip(!publishableKey, "Local Supabase publishable key is required");
    await signIn(page, "guardian-a@example.invalid", "Demo-only-Guardian-A!");

    const result = await page.evaluate(
      async ({ apiUrl, apiKey }) => {
        const authEntry = Object.entries(localStorage).find(
          ([key, value]) =>
            key.startsWith("sb-") && value.includes("access_token"),
        );
        if (!authEntry) throw new Error("Authenticated session was not stored");
        const session = JSON.parse(authEntry[1]) as { access_token: string };
        const response = await fetch(
          `${apiUrl}/rest/v1/pets?id=eq.30000000-0000-0000-0000-000000000002`,
          {
            headers: {
              apikey: apiKey,
              Authorization: `Bearer ${session.access_token}`,
            },
          },
        );
        return { status: response.status, body: await response.json() };
      },
      { apiUrl: supabaseUrl, apiKey: publishableKey! },
    );

    expect(result.status).toBe(200);
    expect(result.body).toEqual([]);
  });
});
