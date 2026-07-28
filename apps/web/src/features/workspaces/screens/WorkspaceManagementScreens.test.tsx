/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { SharedUIProvider } from "@nexus/shared-ui";
import type { WorkspaceMember, WorkspaceRole } from "@nexus/shared-types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createAppStore } from "../../../store/createAppStore";
import { authSuccess } from "../../../store/slices/auth/authSlice";
import { WorkspaceDetailScreen } from "./WorkspaceDetailScreen";
import { WorkspaceInvitationsScreen } from "./WorkspaceInvitationsScreen";
import { WorkspaceMembersScreen } from "./WorkspaceMembersScreen";

const refetchWorkspace = vi.fn();
const refetchMembers = vi.fn();
const refetchInvitations = vi.fn();
const updateWorkspace = vi.fn(() => ({ unwrap: vi.fn() }));
const removeMember = vi.fn(() => ({ unwrap: vi.fn() }));
const updateMemberRole = vi.fn(() => ({ unwrap: vi.fn() }));
const deleteInvitation = vi.fn(() => ({ unwrap: vi.fn() }));

const workspaceFixture = {
  id: "ws-1",
  name: "Nexus Labs",
  slug: "nexus-labs",
  description: "Primary workspace",
  ownerId: "owner-1",
  status: "ACTIVE" as const,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
};

const membersFixture: WorkspaceMember[] = [
  {
    id: "mem-1",
    workspaceId: "ws-1",
    userId: "user-1",
    role: "DEVELOPER" satisfies WorkspaceRole,
    joinedAt: "2026-01-01T00:00:00.000Z",
  },
];

const invitationsFixture = [
  {
    id: "inv-1",
    workspaceId: "ws-1",
    email: "invitee@example.com",
    invitedBy: "owner-1",
    role: "VIEWER" as const,
    status: "PENDING" as const,
    token: "token-1",
    expiresAt: "2026-12-01T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

const workspaceQuery = {
  data: undefined as typeof workspaceFixture | undefined,
  error: undefined as unknown,
  isLoading: false,
  isFetching: false,
  refetch: refetchWorkspace,
};

const membersQuery = {
  data: undefined as typeof membersFixture | undefined,
  error: undefined as unknown,
  isLoading: false,
  isFetching: false,
  refetch: refetchMembers,
};

const invitationsQuery = {
  data: undefined as typeof invitationsFixture | undefined,
  error: undefined as unknown,
  isLoading: false,
  isFetching: false,
  refetch: refetchInvitations,
};

vi.mock("../api", () => ({
  useGetWorkspaceQuery: () => workspaceQuery,
  useListMembersQuery: () => membersQuery,
  useListInvitationsQuery: () => invitationsQuery,
  useUpdateWorkspaceMutation: () => [
    updateWorkspace,
    { isLoading: false, error: undefined, isSuccess: false },
  ],
  useRemoveMemberMutation: () => [
    removeMember,
    { isLoading: false, error: undefined },
  ],
  useUpdateMemberRoleMutation: () => [
    updateMemberRole,
    { isLoading: false, error: undefined },
  ],
  useDeleteInvitationMutation: () => [
    deleteInvitation,
    { isLoading: false, error: undefined },
  ],
  useCreateInvitationMutation: () => [
    vi.fn(),
    { isLoading: false, error: undefined, isSuccess: false },
  ],
}));

const authUser = {
  id: "user-1",
  email: "user@example.com",
  role: "DEVELOPER",
  firstName: "Ada",
  lastName: "Lovelace",
  emailVerified: true,
  isActive: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function renderAt(path: string, ui: ReactElement) {
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

  return render(
    <SharedUIProvider defaultPreference="system">
      <Provider store={store.store}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/workspaces/:workspaceId" element={ui} />
            <Route path="/workspaces/:workspaceId/members" element={ui} />
            <Route path="/workspaces/:workspaceId/invitations" element={ui} />
          </Routes>
        </MemoryRouter>
      </Provider>
    </SharedUIProvider>,
  );
}

describe("Workspace management screens", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    workspaceQuery.data = undefined;
    workspaceQuery.error = undefined;
    workspaceQuery.isLoading = false;
    workspaceQuery.isFetching = false;
    membersQuery.data = undefined;
    membersQuery.error = undefined;
    membersQuery.isLoading = false;
    membersQuery.isFetching = false;
    invitationsQuery.data = undefined;
    invitationsQuery.error = undefined;
    invitationsQuery.isLoading = false;
    invitationsQuery.isFetching = false;
    refetchWorkspace.mockReset();
    refetchMembers.mockReset();
    refetchInvitations.mockReset();
  });

  it("renders workspace detail metadata and settings for owners", () => {
    workspaceQuery.data = { ...workspaceFixture, ownerId: "user-1" };
    membersQuery.data = [
      {
        id: "mem-owner",
        workspaceId: "ws-1",
        userId: "user-1",
        role: "OWNER",
        joinedAt: "2026-01-01T00:00:00.000Z",
      },
    ];

    renderAt("/workspaces/ws-1", <WorkspaceDetailScreen />);

    expect(screen.getByTestId("workspace-detail-screen")).toBeTruthy();
    expect(screen.getByText("Nexus Labs")).toBeTruthy();
    expect(screen.getByTestId("workspace-settings-form")).toBeTruthy();
  });

  it("classifies workspace detail failures with retry", () => {
    workspaceQuery.error = {
      status: 500,
      message: "boom",
      code: "HTTP_500",
    };

    renderAt("/workspaces/ws-1", <WorkspaceDetailScreen />);

    expect(screen.getByTestId("workspace-detail-error")).toBeTruthy();
    expect(screen.getByText("Unable to load workspaces")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Retry loading workspace" }),
    ).toBeTruthy();
  });

  it("renders members and leave action for non-owner self", () => {
    workspaceQuery.data = workspaceFixture;
    membersQuery.data = membersFixture;

    renderAt("/workspaces/ws-1/members", <WorkspaceMembersScreen />);

    expect(screen.getByTestId("workspace-members-screen")).toBeTruthy();
    expect(screen.getByText("user-1")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Leave workspace" }),
    ).toBeTruthy();
  });

  it("renders invitations list", () => {
    workspaceQuery.data = { ...workspaceFixture, ownerId: "user-1" };
    invitationsQuery.data = invitationsFixture;

    renderAt("/workspaces/ws-1/invitations", <WorkspaceInvitationsScreen />);

    expect(screen.getByTestId("workspace-invitations-screen")).toBeTruthy();
    expect(screen.getByText("invitee@example.com")).toBeTruthy();
  });

  it("classifies members forbidden failures", () => {
    membersQuery.error = {
      status: 403,
      message: "Forbidden",
      code: "HTTP_403",
    };

    renderAt("/workspaces/ws-1/members", <WorkspaceMembersScreen />);

    expect(screen.getByTestId("workspace-members-error")).toBeTruthy();
    expect(screen.getByText("Permission denied")).toBeTruthy();
  });
});
