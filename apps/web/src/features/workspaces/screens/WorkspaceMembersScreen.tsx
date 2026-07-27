import { type FC } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  InlineAlert,
  Loader,
  Stack,
  Text,
} from "@nexus/shared-ui";
import type { WorkspaceRole } from "@nexus/shared-types";
import { useSelector } from "react-redux";

import { mapApiError } from "../../../hooks/useApiErrorMessage";
import { WEB_ROUTE_PATHS } from "../../../router/paths";
import { selectUser } from "../../../store/slices/auth/selectors";
import {
  useGetWorkspaceQuery,
  useListMembersQuery,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
} from "../api";

const ROLE_OPTIONS: WorkspaceRole[] = [
  "OWNER",
  "ADMIN",
  "DEVELOPER",
  "VIEWER",
];

export const WorkspaceMembersScreen: FC = () => {
  const { workspaceId = "" } = useParams();
  const authUser = useSelector(selectUser);
  const { data: workspace } = useGetWorkspaceQuery(workspaceId, {
    skip: !workspaceId,
  });
  const { data, error, isLoading, refetch } = useListMembersQuery(workspaceId, {
    skip: !workspaceId,
  });
  const [updateRole, updateState] = useUpdateMemberRoleMutation();
  const [removeMember, removeState] = useRemoveMemberMutation();

  if (!workspaceId) {
    return <Text>Workspace not found.</Text>;
  }

  if (isLoading) {
    return <Loader accessibilityLabel="Loading members" />;
  }

  if (error) {
    const apiError = mapApiError(error);
    return (
      <Stack padding="xl" gap="md">
        <InlineAlert tone="error" title="Unable to load members">
          {apiError.message}
        </InlineAlert>
        {apiError.retryable ? (
          <Button onPress={() => refetch()}>Retry</Button>
        ) : null}
      </Stack>
    );
  }

  const members = data ?? [];
  const canManage =
    authUser?.id === workspace?.ownerId ||
    authUser?.role === "ADMIN" ||
    authUser?.role === "MANAGER";

  return (
    <Stack padding="xl" gap="lg" testID="workspace-members-screen">
      <Stack direction="horizontal" justify="space-between" align="center">
        <Text variant="h2">Members</Text>
        {canManage ? (
          <Link to={`/workspaces/${workspaceId}/invite`}>
            <Button>Invite member</Button>
          </Link>
        ) : null}
      </Stack>
      {members.length === 0 ? <Text>No members yet.</Text> : null}
      <Stack gap="md">
        {members.map((member) => {
          const isOwner = member.role === "OWNER";
          const isSelf = member.userId === authUser?.id;
          return (
            <Stack
              key={member.id}
              direction="horizontal"
              justify="space-between"
              align="center"
              gap="md"
            >
              <Stack gap="xs">
                <Text weight="bold">{member.userId}</Text>
                <Text>Role: {member.role}</Text>
              </Stack>
              {canManage && !isOwner ? (
                <Stack direction="horizontal" gap="sm" align="center">
                  <select
                    aria-label={`Role for ${member.userId}`}
                    value={member.role}
                    disabled={updateState.isLoading}
                    onChange={(event) => {
                      void updateRole({
                        workspaceId,
                        memberId: member.id,
                        body: {
                          role: event.target.value as WorkspaceRole,
                        },
                      });
                    }}
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <Button
                    variant="secondary"
                    disabled={isSelf || removeState.isLoading}
                    onPress={() =>
                      removeMember({ workspaceId, memberId: member.id })
                    }
                  >
                    Remove
                  </Button>
                </Stack>
              ) : null}
            </Stack>
          );
        })}
      </Stack>
      <Link to={`/workspaces/${workspaceId}`}>
        <Button variant="secondary">Back to workspace</Button>
      </Link>
      <Link to={WEB_ROUTE_PATHS.workspaces}>
        <Button variant="secondary">All workspaces</Button>
      </Link>
    </Stack>
  );
};
