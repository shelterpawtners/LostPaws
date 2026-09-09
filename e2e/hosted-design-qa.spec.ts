import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const hosted = process.env.PLAYWRIGHT_HOSTED_QA === "true";

type RuntimeFailures = {
  pageErrors: string[];
  consoleErrors: string[];
  networkFailures: string[];
};

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
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

test.describe("Hosted public and Marketplace design QA", () => {
  test.skip(!hosted, "Set PLAYWRIGHT_HOSTED_QA=true for hosted design QA.");
  test.describe.configure({ timeout: 90_000 });

  test("public shell and flagship Marketplace pass axe and runtime health checks", async ({
    page,
  }, testInfo) => {
    const failures = watchRuntimeFailures(page);

    await page.goto("/");
    await expect(page.locator("#main")).toBeVisible();
    const homeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    await testInfo.attach("axe-home", {
      body: JSON.stringify(homeResults, null, 2),
      contentType: "application/json",
    });
    expect(homeResults.violations, "axe violations on /").toEqual([]);

    await page.goto("/marketplace");
    await waitForStableMarketplace(page);

    const marketplaceResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    await testInfo.attach("axe-marketplace-flagship", {
      body: JSON.stringify(marketplaceResults, null, 2),
      contentType: "application/json",
    });
    expect(
      marketplaceResults.violations,
      "axe violations on /marketplace",
    ).toEqual([]);

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
});
