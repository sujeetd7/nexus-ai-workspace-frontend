/**
 * @vitest-environment jsdom
 */
import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import type { PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createAppStore } from "../store/createAppStore";
import {
  authSuccess,
  logoutCompleted,
} from "../store/slices/auth/authSlice";
import { WorkspaceBootstrap } from "./WorkspaceBootstrap";

const { mockStorage } = vi.hoisted(() => ({
  mockStorage: {
    getSelectedWorkspaceId: vi.fn(async () => null as string | null),
    setSelectedWorkspaceId: vi.fn(async () => undefined),
    clearSelectedWorkspaceId: vi.fn(async () => undefined),
  },
}));

const profileQuery = {
  data: undefined as { id: string } | undefined,
  error: undefined as unknown,
  isLoading: false,
  isFetching: false,
};

const listQuery = {
  data: undefined as Array<{ id: string; ownerId: string }> | undefined,
  error: undefined as unknown,
  isLoading: false,
  isFetching: false,
};

vi.mock("../platform/workspace", () => ({
  createWebSelectedWorkspaceStorage: () => mockStorage,
}));

vi.mock("../api/services/user/userApi", () => ({
  useGetCurrentUserQuery: () => profileQuery,
}));

vi.mock("../api/services/workspace/workspaceApi", () => ({
  useListWorkspacesQuery: () => listQuery,
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

function authenticate(store: ReturnType<typeof createAppStore>["store"]) {
  store.dispatch(
    authSuccess({
      user: authUser,
      tokens: { accessToken: "a", refreshToken: "r" },
    }),
  );
}

describe("WorkspaceBootstrap", () => {
  beforeEach(() => {
    mockStorage.getSelectedWorkspaceId.mockReset();
    mockStorage.setSelectedWorkspaceId.mockReset();
    mockStorage.clearSelectedWorkspaceId.mockReset();
    mockStorage.getSelectedWorkspaceId.mockResolvedValue(null);
    profileQuery.data = { id: "profile-1" };
    profileQuery.error = undefined;
    profileQuery.isLoading = false;
    profileQuery.isFetching = false;
    listQuery.data = undefined;
    listQuery.error = undefined;
    listQuery.isLoading = false;
    listQuery.isFetching = false;
  });

  function wrap(store: ReturnType<typeof createAppStore>["store"]) {
    return function Wrapper({ children }: PropsWithChildren) {
      return (
        <Provider store={store}>
          <WorkspaceBootstrap>{children}</WorkspaceBootstrap>
        </Provider>
      );
    };
  }

  it("does not clear persisted selection before auth is initialized", async () => {
    const { store } = createAppStore({
      config: testConfig,
      startSaga: false,
    });

    renderHook(() => undefined, { wrapper: wrap(store) });

    await waitFor(() => {
      expect(mockStorage.clearSelectedWorkspaceId).not.toHaveBeenCalled();
    });
  });

  it("restores valid persisted workspace after profile + list", async () => {
    mockStorage.getSelectedWorkspaceId.mockResolvedValue("ws-1");
    listQuery.data = [
      { id: "ws-1", ownerId: "user-1" },
      { id: "ws-2", ownerId: "user-2" },
    ];

    const { store } = createAppStore({
      config: testConfig,
      startSaga: false,
    });

    act(() => {
      authenticate(store);
    });

    renderHook(() => undefined, { wrapper: wrap(store) });

    await waitFor(() => {
      expect(store.getState().workspace.status).toBe("ready");
      expect(store.getState().workspace.workspaceId).toBe("ws-1");
    });
  });

  it("clears stale persisted selection and leaves multi-workspace unset", async () => {
    mockStorage.getSelectedWorkspaceId.mockResolvedValue("ws-gone");
    listQuery.data = [
      { id: "ws-1", ownerId: "user-1" },
      { id: "ws-2", ownerId: "user-2" },
    ];

    const { store } = createAppStore({
      config: testConfig,
      startSaga: false,
    });

    act(() => {
      authenticate(store);
    });

    renderHook(() => undefined, { wrapper: wrap(store) });

    await waitFor(() => {
      expect(mockStorage.clearSelectedWorkspaceId).toHaveBeenCalled();
      expect(store.getState().workspace.workspaceId).toBeUndefined();
      expect(store.getState().workspace.status).toBe("ready");
    });
  });

  it("auto-selects the only accessible workspace", async () => {
    listQuery.data = [{ id: "ws-only", ownerId: "user-1" }];

    const { store } = createAppStore({
      config: testConfig,
      startSaga: false,
    });

    act(() => {
      authenticate(store);
    });

    renderHook(() => undefined, { wrapper: wrap(store) });

    await waitFor(() => {
      expect(mockStorage.setSelectedWorkspaceId).toHaveBeenCalledWith("ws-only");
      expect(store.getState().workspace.workspaceId).toBe("ws-only");
    });
  });

  it("clears selection after logout once auth is initialized", async () => {
    const { store } = createAppStore({
      config: testConfig,
      startSaga: false,
    });

    act(() => {
      authenticate(store);
      store.dispatch(logoutCompleted());
    });

    renderHook(() => undefined, { wrapper: wrap(store) });

    await waitFor(() => {
      expect(mockStorage.clearSelectedWorkspaceId).toHaveBeenCalled();
    });
  });
});
