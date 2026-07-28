import { useState, type FC } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  EmptyState,
  InlineAlert,
  Loader,
  Stack,
  Text,
} from "@nexus/shared-ui";
import type { WorkspaceRole } from "@nexus/shared-types";
import { useDispatch, useSelector } from "react-redux";

import { mapApiError } from "../../../hooks/useApiErrorMessage";
import { WEB_ROUTE_PATHS } from "../../../router/paths";
import { createWebSelectedWorkspaceStorage } from "../../../platform/workspace";
import type { AppDispatch } from "../../../store/createAppStore";
import { sessionExpiredAcknowledged } from "../../../store/slices/auth/authSlice";
import { selectUser } from "../../../store/slices/auth/selectors";
import { clearSelectedWorkspace } from "../../../store/slices/workspace/workspaceSlice";
import { selectSelectedWorkspaceId } from "../../../store/slices/workspace/selectors";
import {
  classifySystemFailure,
  workspaceFailureCopy,
} from "../../../system";
import {
  useGetWorkspaceQuery,
  useListMembersQuery,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
} from "../api";

const workspaceStorage = createWebSelectedWorkspaceStorage();

const ROLE_OPTIONS: WorkspaceRole[] = [
  "OWNER",
  "ADMIN",
  "DEVELOPER",
  "VIEWER",
];

export const WorkspaceMembersScreen: FC = () => {
  const { workspaceId = "" } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const authUser = useSelector(selectUser);
  const selectedId = useSelector(selectSelectedWorkspaceId);
  const { data: workspace } = useGetWorkspaceQuery(workspaceId, {
    skip: !workspaceId,
  });
  const { data, error, isLoading, isFetching, refetch } = useListMembersQuery(
    workspaceId,
    {
      skip: !workspaceId,
    },
  );
  const [updateRole, updateState] = useUpdateMemberRoleMutation();
  const [removeMember, removeState] = useRemoveMemberMutation();
  const [retrying, setRetrying] = useState(false);
  const [actionError, setActionError] = useState<string | undefined>();

  if (!workspaceId) {
    return (
      <Stack padding="xl" gap="md">
        <EmptyState
          title="Workspace not found"
          description="No workspace was selected."
        />
      </Stack>
    );
  }

  if (isLoading) {
    return (
      <Stack
        align="center"
        padding="xl"
        gap="md"
        testID="workspace-members-loading"
        accessibilityLabel="Loading members"
      >
        <Loader accessibilityLabel="Loading members" />
        <Text>Loading members…</Text>
      </Stack>
    );
  }

  if (error) {
    const apiError = mapApiError(error);
    const presentation = classifySystemFailure({
      status: apiError.status,
      code: apiError.code,
      message: apiError.message,
      causeType: apiError.causeType,
      retryable: apiError.retryable,
      authAction: apiError.authAction,
      authorizationAction: apiError.authorizationAction,
      context: "authenticated",
    });
    const copy = workspaceFailureCopy(presentation.kind, apiError.message);
    const busy = retrying || isFetching;

    return (
      <Stack padding="xl" gap="md" testID="workspace-members-error">
        <InlineAlert tone={presentation.tone} title={copy.title}>
          {copy.message}
        </InlineAlert>
        {presentation.primaryAction === "retry" ? (
          <Button
            loading={busy}
            disabled={busy}
            onPress={() => {
              setRetrying(true);
              void Promise.resolve(refetch()).finally(() => {
                setRetrying(false);
              });
            }}
            accessibilityLabel="Retry loading members"
          >
            Retry
          </Button>
        ) : null}
        {presentation.primaryAction === "signIn" ? (
          <Button
            onPress={() => {
              dispatch(sessionExpiredAcknowledged());
            }}
            accessibilityLabel="Sign in"
          >
            Sign in
          </Button>
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

      {actionError ? (
        <InlineAlert tone="error" title="Unable to update membership">
          {actionError}
        </InlineAlert>
      ) : null}

      {members.length === 0 ? (
        <EmptyState
          title="No members yet"
          description="Invite a teammate to join this workspace."
          primaryAction={
            canManage ? (
              <Link to={`/workspaces/${workspaceId}/invite`}>
                <Button>Invite member</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <Stack gap="md">
          {members.map((member) => {
            const isOwner = member.role === "OWNER";
            const isSelf = member.userId === authUser?.id;
            const canLeaveSelf =
              isSelf && !isOwner && authUser?.id !== workspace?.ownerId;

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
                <Stack direction="horizontal" gap="sm" align="center">
                  {canManage && !isOwner ? (
                    <>
                      <select
                        aria-label={`Role for ${member.userId}`}
                        value={member.role}
                        disabled={updateState.isLoading}
                        onChange={(event) => {
                          setActionError(undefined);
                          void updateRole({
                            workspaceId,
                            memberId: member.id,
                            body: {
                              role: event.target.value as WorkspaceRole,
                            },
                          })
                            .unwrap()
                            .catch((err) => {
                              setActionError(mapApiError(err).message);
                            });
                        }}
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      {!isSelf ? (
                        <Button
                          variant="secondary"
                          disabled={removeState.isLoading}
                          onPress={() => {
                            setActionError(undefined);
                            void removeMember({
                              workspaceId,
                              memberId: member.id,
                            })
                              .unwrap()
                              .catch((err) => {
                                setActionError(mapApiError(err).message);
                              });
                          }}
                        >
                          Remove
                        </Button>
                      ) : null}
                    </>
                  ) : null}
                  {canLeaveSelf ? (
                    <Button
                      variant="secondary"
                      loading={removeState.isLoading}
                      onPress={() => {
                        setActionError(undefined);
                        void removeMember({
                          workspaceId,
                          memberId: member.id,
                        })
                          .unwrap()
                          .then(async () => {
                            if (selectedId === workspaceId) {
                              await workspaceStorage.clearSelectedWorkspaceId();
                              dispatch(clearSelectedWorkspace());
                            }
                            navigate(WEB_ROUTE_PATHS.workspaces);
                          })
                          .catch((err) => {
                            setActionError(mapApiError(err).message);
                          });
                      }}
                      accessibilityLabel="Leave workspace"
                    >
                      Leave workspace
                    </Button>
                  ) : null}
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      )}
      <Link to={`/workspaces/${workspaceId}`}>
        <Button variant="secondary">Back to workspace</Button>
      </Link>
      <Link to={WEB_ROUTE_PATHS.workspaces}>
        <Button variant="secondary">All workspaces</Button>
      </Link>
    </Stack>
  );
};
