/**
 * @vitest-environment jsdom
 */

import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { SharedUIProvider } from "@nexus/shared-ui";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createAppStore } from "../../store/createAppStore";
import { authSuccess } from "../../store/slices/auth/authSlice";
import { workspaceBootstrapSucceeded } from "../../store/slices/workspace/workspaceSlice";
import { AppShell } from "./AppShell";

const listQuery = vi.hoisted(() => ({
  data: [{ id: "ws-1", name: "Alpha Labs", ownerId: "user-1" }],
  isLoading: false,
  isFetching: false,
  error: undefined,
  refetch: vi.fn(),
}));

vi.mock("../../api/services/workspace/workspaceApi", () => ({
  useListWorkspacesQuery: () => listQuery,
}));

function renderAppShell(initialPath = "/dashboard", authenticated = true) {
  const { store } = createAppStore({
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

  if (authenticated) {
    store.dispatch(
      authSuccess({
        user: {
          id: "user-1",
          email: "alex@example.com",
          role: "USER",
          firstName: "Alex",
          lastName: "Rivera",
          emailVerified: true,
          isActive: true,
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
        tokens: {
          accessToken: "token",
          refreshToken: "refresh",
        },
      }),
    );
    store.dispatch(workspaceBootstrapSucceeded("ws-1"));
  }

  return render(
    <SharedUIProvider defaultPreference="light">
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialPath]}>
          <AppShell forceChrome={authenticated}>
            <div data-testid="shell-child">Child content</div>
          </AppShell>
        </MemoryRouter>
      </Provider>
    </SharedUIProvider>,
  );
}

describe("AppShell", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders authenticated chrome with landmarks", () => {
    renderAppShell("/dashboard");

    expect(screen.getByTestId("application-shell")).toBeTruthy();
    expect(screen.getByTestId("app-shell-sidebar")).toBeTruthy();
    expect(screen.getByTestId("app-shell-topbar")).toBeTruthy();
    expect(screen.getByTestId("application-shell-main")).toBeTruthy();
    expect(screen.getByLabelText("Application sidebar")).toBeTruthy();
    expect(screen.getByLabelText("Application top bar")).toBeTruthy();
    expect(screen.getByLabelText("Main content")).toBeTruthy();
    expect(screen.getByTestId("shell-child")).toBeTruthy();
  });

  it("renders content-only layout for guest routes", () => {
    renderAppShell("/login", false);

    expect(screen.getByTestId("application-shell")).toBeTruthy();
    expect(screen.queryByTestId("app-shell-sidebar")).toBeNull();
    expect(screen.queryByTestId("app-shell-topbar")).toBeNull();
    expect(screen.getByTestId("application-shell-main")).toBeTruthy();
  });

  it("supports loading, empty, and error content states", () => {
    const { store } = createAppStore({
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

    const { rerender } = render(
      <SharedUIProvider defaultPreference="light">
        <Provider store={store}>
          <MemoryRouter>
            <AppShell forceChrome contentState="loading" />
          </MemoryRouter>
        </Provider>
      </SharedUIProvider>,
    );

    expect(screen.getByTestId("app-shell-content-area-loading")).toBeTruthy();

    rerender(
      <SharedUIProvider defaultPreference="light">
        <Provider store={store}>
          <MemoryRouter>
            <AppShell forceChrome contentState="empty" />
          </MemoryRouter>
        </Provider>
      </SharedUIProvider>,
    );
    expect(screen.getByTestId("app-shell-content-area-empty")).toBeTruthy();

    rerender(
      <SharedUIProvider defaultPreference="light">
        <Provider store={store}>
          <MemoryRouter>
            <AppShell forceChrome contentState="error" />
          </MemoryRouter>
        </Provider>
      </SharedUIProvider>,
    );
    expect(screen.getByTestId("app-shell-content-area-error")).toBeTruthy();
  });
});
