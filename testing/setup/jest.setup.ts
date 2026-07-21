import "@testing-library/jest-native/extend-expect";

jest.mock("react-native-safe-area-context", () =>
  require("react-native-safe-area-context/jest/mock"),
);

jest.mock("@react-native/new-app-screen", () => ({
  NewAppScreen: () => null,
}));
