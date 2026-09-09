import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type TestInfo } from "@playwright/test";

const hosted = process.env.PLAYWRIGHT_HOSTED_QA === "true";

type RuntimeFailures = {
  pageErrors: string[];
  consoleErrors: string[];
  networkFailures: string[];
};

function settingOrDefault(name: string, fallback: string) {
  return process.env[name] || fallback;
}

function watchRuntimeFailures(page: Page): RuntimeFailures {
  const failures: RuntimeFailures = {
    pageErrors: [],
    consoleErrors: [],
    networkFailures: [],
  };

  page.on("pageerror", (error) => {
    failures.pageErrors.push(error.message);
  });

  page.on("console", (message) => {
    if (message.type() === "error") {
      failures.consoleErrors.push(message.text());
    }
  });

  page.on("requestfailed", (request) => {
    const errorText = request.failure()?.errorText ?? "unknown network error";
    const url = request.url();

    if (
      errorText.includes("ERR_ABORTED") ||
      errorText.includes("NS_BINDING_ABORTED") ||
      url.endsWith("/favicon.ico")
    ) {
      return;
    }

    failures.networkFailures.push(
      `${request.method()} ${url} — ${errorText}`,
    );
  });

  page.on("response", (response) => {
    if (response.status() >= 500) {
      failures.networkFailures.push(
        `${response.request().method()} ${response.url()} — HTTP ${response.status()}`,
      );
    }
  });

  return failures;
}

function expectNoRuntimeFailures(failures: RuntimeFailures, context: string) {
  expect(failures.pageErrors, `${context}: unexpected page errors`).toEqual([]);
  expect(
    failures.consoleErrors,
    `${context}: unexpected console errors`,
  ).toEqual([]);
  expect(
    failures.networkFailures,
    `${context}: meaningful network failures`,
  ).toEqual([]);
}

async function waitForFonts(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.locator(".dashboardHero")).toBeVisible();
  await waitForFonts(page);
}

async function attachAxe(
  page: Page,
  testInfo: TestInfo,
  name: string,
  context: string,
) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  await testInfo.attach(name, {
    body: JSON.stringify(results, null, 2),
    contentType: "application/json",
  });
  expect(results.violations, `axe violations on ${context}`).toEqual([]);
}

async function waitForStableMarketplace(page: Page) {
  await expect(
    page.getByRole("heading", {
      name: "Useful pet-parent value, without the fine-print hunt.",
    }),
  ).toBeVisible();
  await expect(
    page.locator('[data-marketplace-concept="flagship"]'),
  ).toBeVisible();
  await expect(page.locator(".offerCard").first()).toBeVisible();
  await waitForFonts(page);
}

test.describe("Hosted public and branded-surface design QA", () => {
  test.skip(!hosted, "Set PLAYWRIGHT_HOSTED_QA=true for hosted design QA.");
  test.describe.configure({ timeout: 120_000 });

  test("public shell and flagship Marketplace pass axe and runtime health checks", async ({
    page,
  }, testInfo) => {
    const failures = watchRuntimeFailures(page);

    await page.goto("/");
    await expect(page.locator("#main")).toBeVisible();
    await attachAxe(page, testInfo, "axe-home", "/");

    await page.goto("/marketplace");
    await waitForStableMarketplace(page);
    await attachAxe(
      page,
      testInfo,
      "axe-marketplace-flagship",
      "/marketplace",
    );

    expectNoRuntimeFailures(failures, "public shell / flagship Marketplace");
  });

  test("captures flagship Marketplace at phone, tablet, and desktop sizes", async ({
    page,
  }, testInfo) => {
    const failures = watchRuntimeFailures(page);
    const viewports = [
      { name: "phone", width: 390, height: 844 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1440, height: 1000 },
    ] as const;

    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto("/marketplace");
      await waitForStableMarketplace(page);

      await page.screenshot({
        path: testInfo.outputPath(`marketplace-flagship-${viewport.name}.png`),
        fullPage: true,
        animations: "disabled",
      });
    }

    expectNoRuntimeFailures(failures, "flagship Marketplace review evidence");
  });

  test("Guardian and PetBiz brand propagation passes axe and responsive review", async ({
    page,
  }, testInfo) => {
    const failures = watchRuntimeFailures(page);
    const viewports = [
      { name: "phone", width: 390, height: 844 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1440, height: 1000 },
    ] as const;

    await page.emulateMedia({ reducedMotion: "reduce" });
    await signIn(
      page,
      settingOrDefault(
        "PLAYWRIGHT_GUARDIAN_EMAIL",
        "guardian-a@example.invalid",
      ),
      settingOrDefault(
        "PLAYWRIGHT_GUARDIAN_PASSWORD",
        "Demo-only-Guardian-A!",
      ),
    );
    await expect(
      page.getByRole("heading", { name: /Your pets|Your pet journey starts here/ }),
    ).toBeVisible();
    await attachAxe(page, testInfo, "axe-guardian-dashboard", "/dashboard Guardian");

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto("/dashboard");
      await expect(page.locator(".dashboardHero")).toBeVisible();
      await expect(page.locator(".rolePanel")).toBeVisible();
      await waitForFonts(page);

      if (viewport.name === "phone") {
        await expect(page.locator(".rolePanel")).toHaveCSS("position", "static");
        await page.getByRole("button", { name: "Open menu" }).click();
        await expect(
          page.getByRole("navigation", { name: "Primary navigation" }),
        ).toBeVisible();
        await expect(
          page.getByRole("link", { name: "Marketplace", exact: true }),
        ).toBeVisible();
        await page.getByRole("button", { name: "Close menu" }).click();
      }

      await page.screenshot({
        path: testInfo.outputPath(`guardian-dashboard-${viewport.name}.png`),
        fullPage: true,
        animations: "disabled",
      });
    }

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.setViewportSize({ width: 1440, height: 1000 });
    await signIn(
      page,
      settingOrDefault(
        "PLAYWRIGHT_PARTNER_EMAIL",
        "partner-admin@example.invalid",
      ),
      settingOrDefault("PLAYWRIGHT_PARTNER_PASSWORD", "Demo-only-Partner!"),
    );
    await expect(
      page.getByRole("heading", { name: "Manage your organization" }),
    ).toBeVisible();
    await attachAxe(page, testInfo, "axe-petbiz-dashboard", "/dashboard PetBiz");

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto("/dashboard");
      await expect(page.locator(".dashboardHero")).toBeVisible();
      await expect(page.getByRole("link", { name: /Manage offers/ })).toBeVisible();
      await waitForFonts(page);
      await page.screenshot({
        path: testInfo.outputPath(`petbiz-dashboard-${viewport.name}.png`),
        fullPage: true,
        animations: "disabled",
      });
    }

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/partner/profile");
    await expect(
      page.getByRole("heading", { name: "Make your business easy to understand." }),
    ).toBeVisible();
    await expect(page.locator(".panel").first()).toBeVisible();
    await expect(
      page.getByText("Loading saved profile details…"),
    ).toBeHidden();
    await waitForFonts(page);
    await attachAxe(page, testInfo, "axe-partner-profile", "/partner/profile");
    await page.screenshot({
      path: testInfo.outputPath("petbiz-profile-desktop.png"),
      fullPage: true,
      animations: "disabled",
    });

    await page.goto("/partner/offers");
    await expect(
      page.getByRole("heading", {
        name: "Create clear offers without rewriting history.",
      }),
    ).toBeVisible();
    await expect(page.locator(".dashboardGrid")).toBeVisible();
    await waitForFonts(page);
    await attachAxe(page, testInfo, "axe-partner-offers", "/partner/offers");
    await page.screenshot({
      path: testInfo.outputPath("petbiz-offers-desktop.png"),
      fullPage: true,
      animations: "disabled",
    });

    await page.goto("/forgot-password");
    await expect(
      page.getByRole("heading", { name: "Reset your password" }),
    ).toBeVisible();
    const unrelatedFormWidth = await page.locator(".formPage").evaluate((element) =>
      Math.round(element.getBoundingClientRect().width),
    );
    expect(
      unrelatedFormWidth,
      "brand propagation must not widen unrelated generic form pages",
    ).toBeLessThanOrEqual(620);

    expectNoRuntimeFailures(failures, "Guardian / PetBiz brand propagation");
  });
});
