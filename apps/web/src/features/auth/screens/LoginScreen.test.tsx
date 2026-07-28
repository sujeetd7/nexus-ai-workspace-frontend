/**
 * @vitest-environment jsdom
 */
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { SharedUIProvider } from "@nexus/shared-ui";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createAppStore } from "../../../store/createAppStore";
import { LoginScreen } from "./LoginScreen";

const loginMock = vi.fn();

vi.mock("../../../api/client/axios", () => ({
  getWebSession: () => ({
    login: loginMock,
  }),
}));

function renderLogin() {
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

  return render(
    <SharedUIProvider defaultPreference="system">
      <Provider store={store.store}>
        <MemoryRouter>
          <LoginScreen />
        </MemoryRouter>
      </Provider>
    </SharedUIProvider>,
  );
}

describe("LoginScreen", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    loginMock.mockReset();
  });

  it("renders sign-in form with brand and submit", () => {
    renderLogin();
    expect(screen.getByTestId("login-card")).toBeTruthy();
    expect(screen.getByTestId("login-submit")).toBeTruthy();
    expect(screen.getByText("Nexus AI Workspace")).toBeTruthy();
    expect(screen.getByText("Forgot password?")).toBeTruthy();
  });

  it("shows field validation errors on empty submit", async () => {
    renderLogin();
    fireEvent.click(screen.getByTestId("login-submit"));
    await waitFor(() => {
      expect(
        screen.getByTestId("login-email-input").getAttribute("aria-invalid"),
      ).toBe("true");
    });
  });
});
