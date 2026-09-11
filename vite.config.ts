import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

declare const process: {
  env: Record<string, string | undefined>;
};

const githubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBase = "/LostPaws/";

function githubPagesRouterBase(): Plugin {
  return {
    name: "github-pages-router-base",
    enforce: "pre",
    transform(code, id) {
      if (!githubPages || !id.endsWith("/src/main.tsx")) return null;
      return code.replace(
        "<BrowserRouter>",
        '<BrowserRouter basename="/LostPaws">',
      );
    },
  };
}

export default defineConfig({
  base: githubPages ? githubPagesBase : "/",
  plugins: [githubPagesRouterBase(), react(), tailwindcss()],
  define: {
    __APP_RELEASE__: JSON.stringify(
      process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || "dev",
    ),
  },
  build: { sourcemap: true },
  server: { host: "0.0.0.0", allowedHosts: ["terminal.local"] },
});
