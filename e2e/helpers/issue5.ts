import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  expect,
  type Browser,
  type BrowserContext,
  type Page,
} from "@playwright/test";

export const issue5Hosted = process.env.PLAYWRIGHT_HOSTED_QA === "true";
export const issue5BaseUrl =
  process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173";

export function requiredSetting(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required for Issue #5 audit.`);
  return value;
}

export async function signInPage(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

export async function signOutPage(page: Page) {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/$/);
}

export async function signedInClient(
  email: string,
  password: string,
): Promise<SupabaseClient> {
  const url = requiredSetting("PLAYWRIGHT_SUPABASE_URL");
  const key = requiredSetting("PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY");
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });
  expect(error, `${email} direct database session should sign in`).toBeNull();
  expect(data.user?.email).toBe(email);
  return client;
}

export async function freshSignedInPage(
  browser: Browser,
  email: string,
  password: string,
): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext({ baseURL: issue5BaseUrl });
  const page = await context.newPage();
  await signInPage(page, email, password);
  return { context, page };
}

export function watchRuntime(page: Page) {
  const failures: string[] = [];
  page.on("pageerror", (error) => failures.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") failures.push(`console: ${message.text()}`);
  });
  page.on("requestfailed", (request) => {
    const reason = request.failure()?.errorText || "request failed";
    if (/ERR_ABORTED|NS_BINDING_ABORTED/i.test(reason)) return;
    if (/favicon/i.test(request.url())) return;
    failures.push(
      `requestfailed: ${request.method()} ${request.url()} ${reason}`,
    );
  });
  page.on("response", (response) => {
    if (response.status() >= 500)
      failures.push(`http ${response.status()}: ${response.url()}`);
  });
  return failures;
}

export function expectRuntimeClean(failures: string[]) {
  expect(failures, failures.join("\n")).toEqual([]);
}
