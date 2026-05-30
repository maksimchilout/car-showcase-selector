// Preset bundles tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro, etc.
// Do not add those plugins manually or the app will break with duplicates.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
