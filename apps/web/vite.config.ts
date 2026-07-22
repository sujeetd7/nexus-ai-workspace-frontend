import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
// Package ships named exports; nodenext type re-exports omit them (runtime is fine).
// @ts-expect-error Tamagui vite-plugin types under module nodenext
import { tamaguiAliases, tamaguiPlugin } from "@tamagui/vite-plugin";

const isVitest = process.env.VITEST === "true";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Skip config bundling in Vitest workers; runtime apps use the plugin.
    ...(isVitest
      ? []
      : [
          tamaguiPlugin({
            config: "../../packages/shared-ui/src/tamagui/config.ts",
            components: ["@tamagui/core"],
            disableExtraction: true,
          }),
        ]),
  ],
  resolve: {
    alias: [
      { find: "react-native", replacement: "react-native-web" },
      ...tamaguiAliases({ rnwLite: true }),
    ],
    // Prefer platform web modules (e.g. Button.web.tsx) over the TS default entry.
    extensions: [
      ".web.tsx",
      ".web.ts",
      ".tsx",
      ".ts",
      ".web.jsx",
      ".web.js",
      ".jsx",
      ".js",
      ".json",
    ],
  },
  test: {
    env: {
      VITE_API_URL: "http://localhost:3000/api",
      VITE_GRAPHQL_URL: "http://localhost:3000/graphql",
      VITE_APP_NAME: "Nexus AI Workspace",
    },
  },
});
