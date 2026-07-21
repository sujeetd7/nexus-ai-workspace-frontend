module.exports = {
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  collectCoverage: process.env.CI === "true",

  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/*.stories.*",
    "!**/index.ts",
    "!**/__generated__/**",
  ],

  coverageDirectory: "coverage",

  coverageReporters: ["text", "html", "lcov"],
};
