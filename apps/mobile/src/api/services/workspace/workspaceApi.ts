import type {
  AcceptWorkspaceInvitationRequest,
  AddWorkspaceMemberRequest,
  CreateWorkspaceInvitationRequest,
  CreateWorkspaceRequest,
  RejectWorkspaceInvitationRequest,
  UpdateWorkspaceMemberRoleRequest,
  UpdateWorkspaceRequest,
  Workspace,
  WorkspaceInvitation,
  WorkspaceListParams,
  WorkspaceMember,
} from '@nexus/shared-types';

import { baseApi } from '../baseApi';

export const workspaceApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    listWorkspaces: builder.query<Workspace[], WorkspaceListParams | void>({
      query: params => ({
        url: '/workspaces',
        method: 'GET',
        params: (params ?? undefined) as Record<string, unknown> | undefined,
      }),
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Workspace' as const,
                id,
              })),
              { type: 'Workspace', id: 'LIST' },
            ]
          : [{ type: 'Workspace', id: 'LIST' }],
    }),
    getWorkspace: builder.query<Workspace, string>({
      query: id => ({
        url: `/workspaces/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Workspace', id }],
    }),
    createWorkspace: builder.mutation<Workspace, CreateWorkspaceRequest>({
      query: body => ({
        url: '/workspaces',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: [{ type: 'Workspace', id: 'LIST' }],
    }),
    updateWorkspace: builder.mutation<
      Workspace,
      { id: string; body: UpdateWorkspaceRequest }
    >({
      query: ({ id, body }) => ({
        url: `/workspaces/${id}`,
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Workspace', id },
        { type: 'Workspace', id: 'LIST' },
      ],
    }),
    deleteWorkspace: builder.mutation<void, string>({
      query: id => ({
        url: `/workspaces/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Workspace', id },
        { type: 'Workspace', id: 'LIST' },
      ],
    }),
    listMembers: builder.query<WorkspaceMember[], string>({
      query: workspaceId => ({
        url: `/workspaces/${workspaceId}/members`,
        method: 'GET',
      }),
      providesTags: (_result, _error, workspaceId) => [
        { type: 'WorkspaceMembers', id: workspaceId },
      ],
    }),
    addMember: builder.mutation<
      WorkspaceMember,
      { workspaceId: string; body: AddWorkspaceMemberRequest }
    >({
      query: ({ workspaceId, body }) => ({
        url: `/workspaces/${workspaceId}/members`,
        method: 'POST',
        data: body,
      }),
      invalidatesTags: (_result, _error, { workspaceId }) => [
        { type: 'WorkspaceMembers', id: workspaceId },
      ],
    }),
    updateMemberRole: builder.mutation<
      WorkspaceMember,
      {
        workspaceId: string;
        memberId: string;
        body: UpdateWorkspaceMemberRoleRequest;
      }
    >({
      query: ({ workspaceId, memberId, body }) => ({
        url: `/workspaces/${workspaceId}/members/${memberId}`,
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: (_result, _error, { workspaceId }) => [
        { type: 'WorkspaceMembers', id: workspaceId },
      ],
    }),
    removeMember: builder.mutation<
      void,
      { workspaceId: string; memberId: string }
    >({
      query: ({ workspaceId, memberId }) => ({
        url: `/workspaces/${workspaceId}/members/${memberId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { workspaceId }) => [
        { type: 'WorkspaceMembers', id: workspaceId },
      ],
    }),
    listInvitations: builder.query<WorkspaceInvitation[], string>({
      query: workspaceId => ({
        url: `/workspaces/${workspaceId}/invitations`,
        method: 'GET',
      }),
      providesTags: (_result, _error, workspaceId) => [
        { type: 'WorkspaceInvitations', id: workspaceId },
      ],
    }),
    createInvitation: builder.mutation<
      WorkspaceInvitation,
      { workspaceId: string; body: CreateWorkspaceInvitationRequest }
    >({
      query: ({ workspaceId, body }) => ({
        url: `/workspaces/${workspaceId}/invitations`,
        method: 'POST',
        data: body,
      }),
      invalidatesTags: (_result, _error, { workspaceId }) => [
        { type: 'WorkspaceInvitations', id: workspaceId },
      ],
    }),
    acceptInvitation: builder.mutation<
      WorkspaceInvitation,
      AcceptWorkspaceInvitationRequest
    >({
      query: body => ({
        url: '/workspaces/invitations/accept',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: [
        { type: 'Workspace', id: 'LIST' },
        { type: 'WorkspaceInvitations', id: 'LIST' },
      ],
    }),
    rejectInvitation: builder.mutation<
      WorkspaceInvitation,
      RejectWorkspaceInvitationRequest
    >({
      query: body => ({
        url: '/workspaces/invitations/reject',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: [{ type: 'WorkspaceInvitations', id: 'LIST' }],
    }),
    deleteInvitation: builder.mutation<void, string>({
      query: invitationId => ({
        url: `/workspaces/invitations/${invitationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'WorkspaceInvitations', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListWorkspacesQuery,
  useGetWorkspaceQuery,
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useListMembersQuery,
  useAddMemberMutation,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
  useListInvitationsQuery,
  useCreateInvitationMutation,
  useAcceptInvitationMutation,
  useRejectInvitationMutation,
  useDeleteInvitationMutation,
} = workspaceApi;
