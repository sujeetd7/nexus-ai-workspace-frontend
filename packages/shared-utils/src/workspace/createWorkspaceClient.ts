import type {
  CreateWorkspaceClientOptions,
  Workspace,
  WorkspaceClient,
  WorkspaceInvitation,
  WorkspaceMember,
} from "@nexus/shared-types";

export function createWorkspaceClient(
  options: CreateWorkspaceClientOptions,
): WorkspaceClient {
  const { client } = options;

  return {
    async listWorkspaces(params, signal) {
      const { data } = await client.get<Workspace[]>("/workspaces", {
        signal,
        params: params as Record<string, unknown> | undefined,
      });
      return data;
    },

    async createWorkspace(input, signal) {
      const { data } = await client.post<Workspace>("/workspaces", input, {
        signal,
      });
      return data;
    },

    async getWorkspace(id, signal) {
      const { data } = await client.get<Workspace>(`/workspaces/${id}`, {
        signal,
      });
      return data;
    },

    async updateWorkspace(id, input, signal) {
      const { data } = await client.patch<Workspace>(
        `/workspaces/${id}`,
        input,
        { signal },
      );
      return data;
    },

    async deleteWorkspace(id, signal) {
      await client.delete(`/workspaces/${id}`, { signal });
    },

    async listMembers(workspaceId, signal) {
      const { data } = await client.get<WorkspaceMember[]>(
        `/workspaces/${workspaceId}/members`,
        { signal },
      );
      return data;
    },

    async addMember(workspaceId, input, signal) {
      const { data } = await client.post<WorkspaceMember>(
        `/workspaces/${workspaceId}/members`,
        input,
        { signal },
      );
      return data;
    },

    async updateMemberRole(workspaceId, memberId, input, signal) {
      const { data } = await client.patch<WorkspaceMember>(
        `/workspaces/${workspaceId}/members/${memberId}`,
        input,
        { signal },
      );
      return data;
    },

    async removeMember(workspaceId, memberId, signal) {
      await client.delete(
        `/workspaces/${workspaceId}/members/${memberId}`,
        { signal },
      );
    },

    async listInvitations(workspaceId, signal) {
      const { data } = await client.get<WorkspaceInvitation[]>(
        `/workspaces/${workspaceId}/invitations`,
        { signal },
      );
      return data;
    },

    async createInvitation(workspaceId, input, signal) {
      const { data } = await client.post<WorkspaceInvitation>(
        `/workspaces/${workspaceId}/invitations`,
        input,
        { signal },
      );
      return data;
    },

    async acceptInvitation(input, signal) {
      const { data } = await client.post<WorkspaceInvitation>(
        "/workspaces/invitations/accept",
        input,
        { signal },
      );
      return data;
    },

    async rejectInvitation(input, signal) {
      const { data } = await client.post<WorkspaceInvitation>(
        "/workspaces/invitations/reject",
        input,
        { signal },
      );
      return data;
    },

    async deleteInvitation(invitationId, signal) {
      await client.delete(`/workspaces/invitations/${invitationId}`, {
        signal,
      });
    },
  };
}
