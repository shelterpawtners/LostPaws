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
    page.getByRole("heading", { name: "Find value that fits your world." }),
  ).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

test.describe("Hosted public and Marketplace design QA", () => {
  test.skip(!hosted, "Set PLAYWRIGHT_HOSTED_QA=true for hosted design QA.");
  test.describe.configure({ timeout: 90_000 });

  test("public shell and Marketplace pass axe and runtime health checks", async ({
    page,
  }, testInfo) => {
    const failures = watchRuntimeFailures(page);

    for (const [routeName, route] of [
      ["home", "/"],
      ["marketplace", "/marketplace"],
    ] as const) {
      await page.goto(route);
      if (route === "/marketplace") {
        await waitForStableMarketplace(page);
      } else {
        await expect(page.locator("#main")).toBeVisible();
      }

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      await testInfo.attach(`axe-${routeName}`, {
        body: JSON.stringify(results, null, 2),
        contentType: "application/json",
      });
      expect(results.violations, `axe violations on ${route}`).toEqual([]);
    }

    expectNoRuntimeFailures(failures, "public shell / Marketplace");
  });

  test("captures Marketplace review evidence at phone, tablet, and desktop sizes", async ({
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
        path: testInfo.outputPath(`marketplace-${viewport.name}.png`),
        fullPage: true,
        animations: "disabled",
      });
    }

    expectNoRuntimeFailures(failures, "Marketplace responsive evidence");
  });
});
