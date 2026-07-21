const base = require("./jest.base.cjs");

module.exports = {
  ...base,

  testEnvironment: "jsdom",

  setupFilesAfterEnv: ["<rootDir>/../../testing/setup/jest.setup.ts"],
};
