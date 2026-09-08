import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:5173";
const useHostedApplication = Boolean(process.env.PLAYWRIGHT_BASE_URL);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "line",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer:
    process.env.PLAYWRIGHT_SKIP_WEBSERVER || useHostedApplication
      ? undefined
      : {
          command: "npm run dev -- --host 127.0.0.1",
          url: "http://127.0.0.1:5173",
          reuseExistingServer: !process.env.CI,
          env: {
            ...process.env,
            VITE_SUPABASE_URL:
              process.env.PLAYWRIGHT_SUPABASE_URL ??
              process.env.VITE_SUPABASE_URL ??
              "",
            VITE_SUPABASE_PUBLISHABLE_KEY:
              process.env.PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY ??
              process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
              "",
          },
        },
});
