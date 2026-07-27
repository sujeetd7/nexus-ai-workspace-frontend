import { defineConfig } from "vitest/config";

const coverageEnabled = process.env.QUALITY_COVERAGE === "1";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
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
});
