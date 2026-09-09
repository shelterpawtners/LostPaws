import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { sourcemap: true },
  server: { host: "0.0.0.0", allowedHosts: ["terminal.local"] },
});
