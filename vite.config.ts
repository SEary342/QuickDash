/// <reference types="vitest/config" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteSingleFile } from "vite-plugin-singlefile";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  define: {
    "process.env": {},
    "import.meta.env.APP_VERSION": JSON.stringify(
      process.env.npm_package_version
    ),
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.js",
    coverage: {
      provider: "v8",
      exclude: [
        "src/tests/**",
        "vite.config.ts",
        "src/vite-env.d.ts",
        "coverage/**",
        "eslint.config.js",
      ],
    },
  },
  build: {
    outDir: "docs",
  },
});
