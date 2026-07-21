const base = require("./jest.base.cjs");

module.exports = {
  ...base,

  testEnvironment: "node",

  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
};
