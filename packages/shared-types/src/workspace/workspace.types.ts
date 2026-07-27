/** Workspace domain types — curated from Gateway OpenAPI (W6). */

export type WorkspaceStatus = "ACTIVE" | "ARCHIVED" | "SUSPENDED";

export type WorkspaceRole = "OWNER" | "ADMIN" | "DEVELOPER" | "VIEWER";

export type InvitationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";

export interface Workspace {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description?: string;
  readonly ownerId: string;
  readonly status: WorkspaceStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface WorkspaceMember {
  readonly id: string;
  readonly workspaceId: string;
  readonly userId: string;
  readonly role: WorkspaceRole;
  readonly joinedAt: string;
}

export interface WorkspaceInvitation {
  readonly id: string;
  readonly workspaceId: string;
  readonly email: string;
  readonly invitedBy: string;
  readonly role: WorkspaceRole;
  readonly status: InvitationStatus;
  readonly token: string;
  readonly expiresAt: string;
  readonly createdAt: string;
}

export interface CreateWorkspaceRequest {
  readonly name: string;
  readonly description?: string;
  readonly ownerId: string;
}

export interface UpdateWorkspaceRequest {
  readonly name?: string;
  readonly description?: string;
  readonly status?: WorkspaceStatus;
}

export interface AddWorkspaceMemberRequest {
  readonly userId: string;
  readonly role: WorkspaceRole;
}

export interface UpdateWorkspaceMemberRoleRequest {
  readonly role: WorkspaceRole;
}

export interface CreateWorkspaceInvitationRequest {
  readonly email: string;
  readonly invitedBy: string;
  readonly role: WorkspaceRole;
}

export interface AcceptWorkspaceInvitationRequest {
  readonly token: string;
  readonly email?: string;
}

export interface RejectWorkspaceInvitationRequest {
  readonly token: string;
}

export interface WorkspaceListParams {
  readonly page?: number;
  readonly limit?: number;
}

export interface WorkspaceHttpClient {
  get<T>(
    url: string,
    config?: { signal?: AbortSignal; params?: Record<string, unknown> },
  ): Promise<{ data: T }>;
  post<T>(
    url: string,
    body?: unknown,
    config?: { signal?: AbortSignal },
  ): Promise<{ data: T }>;
  patch<T>(
    url: string,
    body?: unknown,
    config?: { signal?: AbortSignal },
  ): Promise<{ data: T }>;
  delete<T>(
    url: string,
    config?: { signal?: AbortSignal },
  ): Promise<{ data: T }>;
}

export interface CreateWorkspaceClientOptions {
  readonly client: WorkspaceHttpClient;
}

export interface WorkspaceClient {
  listWorkspaces(
    params?: WorkspaceListParams,
    signal?: AbortSignal,
  ): Promise<Workspace[]>;
  createWorkspace(
    input: CreateWorkspaceRequest,
    signal?: AbortSignal,
  ): Promise<Workspace>;
  getWorkspace(id: string, signal?: AbortSignal): Promise<Workspace>;
  updateWorkspace(
    id: string,
    input: UpdateWorkspaceRequest,
    signal?: AbortSignal,
  ): Promise<Workspace>;
  deleteWorkspace(id: string, signal?: AbortSignal): Promise<void>;
  listMembers(
    workspaceId: string,
    signal?: AbortSignal,
  ): Promise<WorkspaceMember[]>;
  addMember(
    workspaceId: string,
    input: AddWorkspaceMemberRequest,
    signal?: AbortSignal,
  ): Promise<WorkspaceMember>;
  updateMemberRole(
    workspaceId: string,
    memberId: string,
    input: UpdateWorkspaceMemberRoleRequest,
    signal?: AbortSignal,
  ): Promise<WorkspaceMember>;
  removeMember(
    workspaceId: string,
    memberId: string,
    signal?: AbortSignal,
  ): Promise<void>;
  listInvitations(
    workspaceId: string,
    signal?: AbortSignal,
  ): Promise<WorkspaceInvitation[]>;
  createInvitation(
    workspaceId: string,
    input: CreateWorkspaceInvitationRequest,
    signal?: AbortSignal,
  ): Promise<WorkspaceInvitation>;
  acceptInvitation(
    input: AcceptWorkspaceInvitationRequest,
    signal?: AbortSignal,
  ): Promise<WorkspaceInvitation>;
  rejectInvitation(
    input: RejectWorkspaceInvitationRequest,
    signal?: AbortSignal,
  ): Promise<WorkspaceInvitation>;
  deleteInvitation(invitationId: string, signal?: AbortSignal): Promise<void>;
}

export type SelectedWorkspaceStatus =
  | "uninitialized"
  | "loading"
  | "ready"
  | "error";

export interface SelectedWorkspaceState {
  readonly workspaceId?: string;
  readonly status: SelectedWorkspaceStatus;
  readonly error?: string;
}
