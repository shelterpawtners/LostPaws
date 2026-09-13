import { expect, test } from "@playwright/test";

const hosted = process.env.PLAYWRIGHT_HOSTED_QA === "true";

// This checks the live production domain directly (not baseURL/SITE_URL,
// which for other hosted-QA specs may point at a shared-dev target) because
// these headers are set by vercel.json and only ever served by Vercel's own
// edge for shelterpawtners.com — GitHub Pages serves the same app without
// them. Issue #141.
test.describe("Production security headers", () => {
  test.skip(!hosted, "Set PLAYWRIGHT_HOSTED_QA=true for hosted QA runs.");

  test("shelterpawtners.com serves the expected security headers", async ({
    request,
  }) => {
    const response = await request.get("https://shelterpawtners.com/");
    expect(response.ok()).toBe(true);
    const headers = response.headers();

    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["content-security-policy"]).toContain(
      "connect-src 'self' https://jukmlmryykcnjtpblbja.supabase.co",
    );
    expect(headers["strict-transport-security"]).toContain("max-age=");
  });

  test("a client-side route also carries the same headers", async ({
    request,
  }) => {
    const response = await request.get("https://shelterpawtners.com/marketplace");
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-security-policy"]).toContain(
      "default-src 'self'",
    );
  });
});
