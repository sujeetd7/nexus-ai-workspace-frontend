/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { SharedUIProvider } from "@nexus/shared-ui";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createAppStore } from "../../../store/createAppStore";
import { authSuccess } from "../../../store/slices/auth/authSlice";
import { setSelectedWorkspace } from "../../../store/slices/workspace";
import { WorkspaceListScreen } from "./WorkspaceListScreen";

const refetch = vi.fn();
const listState = {
  data: undefined as
    | Array<{
        id: string;
        name: string;
        slug: string;
        description?: string;
        ownerId: string;
        status: "ACTIVE";
        createdAt: string;
        updatedAt: string;
      }>
    | undefined,
  error: undefined as unknown,
  isLoading: false,
  isFetching: false,
  refetch,
};

vi.mock("../api", () => ({
  useListWorkspacesQuery: () => listState,
}));

vi.mock("../../../hooks/useWorkspaceSwitch", () => ({
  useWorkspaceSwitch: () => vi.fn(async () => undefined),
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

function renderScreen(options?: { selectedWorkspaceId?: string }) {
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

  store.store.dispatch(
    authSuccess({
      user: authUser,
      tokens: { accessToken: "a", refreshToken: "r" },
    }),
  );

  if (options?.selectedWorkspaceId) {
    store.store.dispatch(setSelectedWorkspace(options.selectedWorkspaceId));
  }

  return render(
    <SharedUIProvider defaultPreference="system">
      <Provider store={store.store}>
        <MemoryRouter>
          <WorkspaceListScreen />
        </MemoryRouter>
      </Provider>
    </SharedUIProvider>,
  );
}

describe("WorkspaceListScreen", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    listState.data = undefined;
    listState.error = undefined;
    listState.isLoading = false;
    listState.isFetching = false;
    refetch.mockReset();
  });

  it("shows loading skeleton state", () => {
    listState.isLoading = true;
    renderScreen();
    expect(screen.getByTestId("workspace-list-loading")).toBeTruthy();
    expect(screen.getByTestId("workspace-list-skeleton-0")).toBeTruthy();
    expect(screen.getByTestId("workspace-list-brand")).toBeTruthy();
  });

  it("shows continue when a workspace is selected", () => {
    listState.data = [
      {
        id: "ws-1",
        name: "Alpha",
        slug: "alpha",
        ownerId: "user-1",
        status: "ACTIVE",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ];
    renderScreen({ selectedWorkspaceId: "ws-1" });
    expect(screen.getByText("Continue")).toBeTruthy();
    expect(screen.getByText("Selected")).toBeTruthy();
    expect(screen.getByTestId("workspace-list-brand")).toBeTruthy();
  });

  it("shows empty state", () => {
    listState.data = [];
    renderScreen();
    expect(screen.getByTestId("workspace-list-empty")).toBeTruthy();
    expect(screen.getByText("No workspaces yet")).toBeTruthy();
  });

  it("renders multiple workspaces for selection", () => {
    listState.data = [
      {
        id: "ws-1",
        name: "Alpha",
        slug: "alpha",
        ownerId: "user-1",
        status: "ACTIVE",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "ws-2",
        name: "Beta",
        slug: "beta",
        ownerId: "user-2",
        status: "ACTIVE",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ];
    renderScreen();
    expect(screen.getByTestId("workspace-row-ws-1")).toBeTruthy();
    expect(screen.getByTestId("workspace-row-ws-2")).toBeTruthy();
  });

  it("shows retry on retryable API failure", async () => {
    const user = userEvent.setup();
    listState.error = { status: 500, message: "boom", code: "HTTP_500" };
    renderScreen();
    expect(screen.getByTestId("workspace-list-error")).toBeTruthy();
    await user.click(screen.getByText("Retry"));
    expect(refetch).toHaveBeenCalled();
  });

  it("shows session expired for unauthorized", () => {
    listState.error = {
      status: 401,
      message: "Unauthorized",
      code: "HTTP_401",
    };
    renderScreen();
    expect(screen.getByText("Session expired")).toBeTruthy();
    expect(screen.getByText("Sign in")).toBeTruthy();
  });

  it("shows permission denied for forbidden", () => {
    listState.error = {
      status: 403,
      message: "Forbidden",
      code: "HTTP_403",
    };
    renderScreen();
    expect(screen.getByText("Permission denied")).toBeTruthy();
    expect(screen.queryByText("Sign in")).toBeNull();
  });

  it("shows service unavailable for 503", () => {
    listState.error = {
      status: 503,
      message: "Unavailable",
      code: "HTTP_503",
    };
    renderScreen();
    expect(screen.getByText("Service unavailable")).toBeTruthy();
    expect(screen.getByText("Retry")).toBeTruthy();
  });
});
