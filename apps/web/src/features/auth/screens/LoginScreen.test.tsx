/**
 * @vitest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { SharedUIProvider } from "@nexus/shared-ui";
import { describe, expect, it, vi } from "vitest";

import { createAppStore } from "../../../store/createAppStore";
import { LoginScreen } from "./LoginScreen";

vi.mock("../../../api/client/axios", () => ({
  getWebSession: () => ({
    login: vi.fn(),
  }),
}));

describe("LoginScreen", () => {
  it("renders sign-in form", () => {
    const store = createAppStore({
      config: {
        buildMode: "test",
        apiBaseUrl: "http://localhost:3000/api/v1",
        graphqlUrl: "http://localhost:3000/graphql",
        appName: "Nexus",
        isDevelopment: false,
        isProduction: false,
      },
      startSaga: false,
    });

    render(
      <SharedUIProvider defaultPreference="system">
        <Provider store={store.store}>
          <MemoryRouter>
            <LoginScreen />
          </MemoryRouter>
        </Provider>
      </SharedUIProvider>,
    );

    expect(screen.getByTestId("login-card")).toBeTruthy();
    expect(screen.getByTestId("login-submit")).toBeTruthy();
  });
});
