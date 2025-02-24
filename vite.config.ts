import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteSingleFile } from "vite-plugin-singlefile";
import tailwindcss from "@tailwindcss/vite";
import svgLoader from "vite-svg-loader";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile(),
    svgLoader(),
  ],
  define: {
    "process.env": {},
    "import.meta.env.APP_VERSION": JSON.stringify(
      process.env.npm_package_version
    ),
  },
  build: {
    outDir: "docs",
  },
});
