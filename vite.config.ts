import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

declare const process: {
  env: Record<string, string | undefined>;
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __APP_RELEASE__: JSON.stringify(
      process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || "dev",
    ),
  },
  build: { sourcemap: true },
  server: { host: "0.0.0.0", allowedHosts: ["terminal.local"] },
});
