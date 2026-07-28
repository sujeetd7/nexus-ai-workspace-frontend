/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { SharedUIProvider } from "@nexus/shared-ui";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createAppStore } from "../../store/createAppStore";
import {
  authSuccess,
  sessionExpired,
  sessionExpiredAcknowledged,
} from "../../store/slices/auth/authSlice";
import { workspaceBootstrapFailed } from "../../store/slices/workspace/workspaceSlice";
import { ProtectedRoute } from "./AuthRouteGuard";

const listRefetch = vi.fn();
const profileRefetch = vi.fn();

const listState = {
  data: undefined as unknown,
  error: undefined as unknown,
  isLoading: false,
  isFetching: false,
  refetch: listRefetch,
};

const profileState = {
  data: undefined as unknown,
  error: undefined as unknown,
  isLoading: false,
  isFetching: false,
  refetch: profileRefetch,
};

vi.mock("../../api/services/workspace/workspaceApi", () => ({
  useListWorkspacesQuery: () => listState,
}));

vi.mock("../../api/services/user/userApi", () => ({
  useGetCurrentUserQuery: () => profileState,
}));

const authUser = {
  id: "user-1",
  email: "user@example.com",
  role: "DEVELOPER",
  firstName: "A",
  lastName: "B",
  emailVerified: true,
  isActive: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const testConfig = {
  buildMode: "test" as const,
  apiBaseUrl: "http://localhost:3000/api/v1",
  graphqlUrl: "http://localhost:3000/graphql",
  appName: "Nexus",
  isDevelopment: false,
  isProduction: false,
};

function renderProtected(store: ReturnType<typeof createAppStore>["store"]) {
  return render(
    <SharedUIProvider defaultPreference="system">
      <Provider store={store}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div data-testid="shell-content">Protected shell</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div data-testid="login-page">Login</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    </SharedUIProvider>,
  );
}

describe("ProtectedRoute system failure states", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    listState.data = undefined;
    listState.error = undefined;
    listState.isFetching = false;
    profileState.data = undefined;
    profileState.error = undefined;
    profileState.isFetching = false;
    listRefetch.mockReset();
    profileRefetch.mockReset();
  });

  it("shows session expired and clears shell with sign-in action", async () => {
    const user = userEvent.setup();
    const { store } = createAppStore({ config: testConfig, startSaga: false });
    store.dispatch(
      authSuccess({
        user: authUser,
        tokens: { accessToken: "a", refreshToken: "r" },
      }),
    );
    store.dispatch(sessionExpired());

    renderProtected(store);

    expect(screen.queryByTestId("shell-content")).toBeNull();
    expect(screen.getByTestId("session-expired")).toBeTruthy();
    expect(screen.getByText("Session expired")).toBeTruthy();

    await user.click(screen.getByTestId("session-expired-sign-in"));
    expect(store.getState().auth.status).toBe("unauthenticated");
    expect(screen.getByTestId("login-page")).toBeTruthy();
  });

  it("redirects unauthorized users to login without a loop", () => {
    const { store } = createAppStore({ config: testConfig, startSaga: false });
    store.dispatch(sessionExpired());
    store.dispatch(sessionExpiredAcknowledged());

    renderProtected(store);
    expect(screen.getByTestId("login-page")).toBeTruthy();
    expect(screen.queryByTestId("session-expired")).toBeNull();
    expect(screen.queryByTestId("shell-content")).toBeNull();
  });

  it("preserves session on forbidden workspace bootstrap and offers sign out", () => {
    const { store } = createAppStore({ config: testConfig, startSaga: false });
    store.dispatch(
      authSuccess({
        user: authUser,
        tokens: { accessToken: "a", refreshToken: "r" },
      }),
    );
    store.dispatch(
      workspaceBootstrapFailed("You do not have permission to list workspaces."),
    );
    listState.error = {
      status: 403,
      message: "Forbidden",
      code: "HTTP_403",
    };

    renderProtected(store);

    expect(store.getState().auth.authenticated).toBe(true);
    expect(screen.getByTestId("workspace-bootstrap-error")).toBeTruthy();
    expect(screen.getByText("Permission denied")).toBeTruthy();
    expect(screen.getByTestId("workspace-bootstrap-error-sign-out")).toBeTruthy();
    expect(screen.queryByTestId("workspace-bootstrap-error-sign-in")).toBeNull();
  });

  it("retries bootstrap failure once with busy state", async () => {
    const user = userEvent.setup();
    const { store } = createAppStore({ config: testConfig, startSaga: false });
    store.dispatch(
      authSuccess({
        user: authUser,
        tokens: { accessToken: "a", refreshToken: "r" },
      }),
    );
    store.dispatch(workspaceBootstrapFailed("Unable to load workspaces."));
    listState.error = {
      status: 503,
      message: "Unavailable",
      code: "HTTP_503",
    };
    listRefetch.mockResolvedValue({});

    renderProtected(store);

    const retry = screen.getByTestId("workspace-bootstrap-error-retry");
    await user.click(retry);
    expect(listRefetch).toHaveBeenCalledTimes(1);
  });
});
