import { defineConfig } from "vitest/config";

const coverageEnabled = process.env.QUALITY_COVERAGE === "1";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      enabled: coverageEnabled,
      ...(coverageEnabled
        ? {
            provider: "v8",
            reporter: ["text", "json", "json-summary", "lcov", "html"],
            reportsDirectory: "./coverage",
          }
        : {}),
    },
  },
  resolve: {
    alias: {
      "react-native": "react-native-web",
    },
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
});
