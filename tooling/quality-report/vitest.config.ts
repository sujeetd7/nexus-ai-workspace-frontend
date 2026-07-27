import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    root: ".",
    include: ["src/**/*.{test,spec}.ts"],
    exclude: ["**/node_modules/**", "**/dist/**"],
  },
});
