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

  // Owner direction (2026-09-12): the support form must not live inside the
  // account dropdown. The menu links to a page where the form is immediately
  // usable, rather than revealing a form behind a second toggle in a panel.
  test("account menu links to a support page where the form is ready to use", async ({
    page,
  }) => {
    await signIn(page, "guardian-a@example.invalid", "Demo-only-Guardian-A!");
    const accountMenu = page.locator(".guardianAccountMenu");

    await accountMenu.locator("summary").click();
    const supportLink = accountMenu.getByRole("link", {
      name: "Help & support",
    });
    await expect(supportLink).toBeVisible();
    await supportLink.click();

    await expect(page).toHaveURL(/\/support$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "How can we help?" }),
    ).toBeVisible();

    // No further clicks: the fields are present on arrival.
    await expect(page.getByLabel("Subject")).toBeVisible();
    await expect(page.getByLabel("What happened?")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Send request" }),
    ).toBeVisible();
    await expect(accountMenu).toHaveCount(1);
  });

  test("a signed-in Guardian can submit a support request and gets a reference", async ({
    page,
  }) => {
    await signIn(page, "guardian-a@example.invalid", "Demo-only-Guardian-A!");
    await page.goto("/support");

    const subject = `Playwright support check ${Date.now()}`;
    await page.getByLabel("Subject").fill(subject);
    await page
      .getByLabel("What happened?")
      .fill("Submitted by the support page regression test.");
    await page.getByRole("button", { name: "Send request" }).click();

    await expect(page.getByText(/Your reference is/)).toBeVisible();
    // The request appears in the Guardian's own history, which exercises the
    // reporter-scoped read path as well as the insert.
    await expect(
      page.getByRole("heading", { name: "Your recent requests" }),
    ).toBeVisible();
    await expect(page.getByText(subject)).toBeVisible();
  });

  test("support page gives signed-out visitors a route instead of a dead end", async ({
    page,
  }) => {
    await page.goto("/support");
    await expect(
      page.getByRole("heading", { level: 1, name: "How can we help?" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Sign in to send a request" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Email contact@shelterpawtners\.com/ }),
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
