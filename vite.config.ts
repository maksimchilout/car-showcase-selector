import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { leadApiPlugin } from "./vite/lead-api-plugin";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
    leadApiPlugin(),
  ],
  build: {
    outDir: "dist",
  },
  server: {
    port: 8080,
  },
  preview: {
    port: 4173,
  },
});
