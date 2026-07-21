const base = require("./jest.base.cjs");

module.exports = {
  ...base,

  preset: "react-native",

  testEnvironment: "node",

  setupFiles: ["<rootDir>/../../testing/setup/jest.polyfills.ts"],

  setupFilesAfterEnv: ["<rootDir>/../../testing/setup/jest.setup.ts"],

  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|@react-navigation)/)",
  ],
};
