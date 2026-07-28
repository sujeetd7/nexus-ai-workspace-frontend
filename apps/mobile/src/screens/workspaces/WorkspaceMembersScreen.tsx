import { useState, type FC } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Button,
  EmptyState,
  InlineAlert,
  Loader,
  Stack,
  Text,
} from '@nexus/shared-ui';
import type { WorkspaceRole } from '@nexus/shared-types';
import { useDispatch, useSelector } from 'react-redux';

import {
  useGetWorkspaceQuery,
  useListMembersQuery,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
} from '../../api/services/workspace/workspaceApi';
import { mapApiError } from '../../hooks/useApiErrorMessage';
import type { RootStackParamList } from '../../navigation/types';
import { MOBILE_ROUTE_NAMES } from '../../navigation/types';
import { createMobileSelectedWorkspaceStorage } from '../../platform/workspace/createMobileSelectedWorkspaceStorage';
import type { AppDispatch } from '../../store/createAppStore';
import { sessionExpiredAcknowledged } from '../../store/slices/auth/authSlice';
import { selectUser } from '../../store/slices/auth/selectors';
import { clearSelectedWorkspace } from '../../store/slices/workspace/workspaceSlice';
import { selectSelectedWorkspaceId } from '../../store/slices/workspace/selectors';
import {
  classifySystemFailure,
  workspaceFailureCopy,
} from '../../system';

const workspaceStorage = createMobileSelectedWorkspaceStorage();

const ROLE_OPTIONS: WorkspaceRole[] = [
  'OWNER',
  'ADMIN',
  'DEVELOPER',
  'VIEWER',
];

type MembersRoute = RouteProp<RootStackParamList, 'WorkspaceMembers'>;

export const WorkspaceMembersScreen: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<MembersRoute>();
  const workspaceId = route.params?.workspaceId ?? '';
  const dispatch = useDispatch<AppDispatch>();
  const authUser = useSelector(selectUser);
  const selectedId = useSelector(selectSelectedWorkspaceId);
  const { data: workspace } = useGetWorkspaceQuery(workspaceId, {
    skip: !workspaceId,
  });
  const { data, error, isLoading, isFetching, refetch } = useListMembersQuery(
    workspaceId,
    { skip: !workspaceId },
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
        testID="mobile-workspace-members-loading"
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
      context: 'authenticated',
    });
    const copy = workspaceFailureCopy(presentation.kind, apiError.message);
    const busy = retrying || isFetching;

    return (
      <Stack padding="xl" gap="md" testID="mobile-workspace-members-error">
        <InlineAlert tone={presentation.tone} title={copy.title}>
          {copy.message}
        </InlineAlert>
        {presentation.primaryAction === 'retry' ? (
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
        {presentation.primaryAction === 'signIn' ? (
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
    authUser?.role === 'ADMIN' ||
    authUser?.role === 'MANAGER';

  return (
    <Stack padding="xl" gap="lg" testID="mobile-workspace-members-screen">
      <Stack
        direction="horizontal"
        justify="space-between"
        align="center"
        gap="md"
      >
        <Text variant="h2" accessibilityRole="heading">
          Members
        </Text>
        {canManage ? (
          <Button
            onPress={() =>
              navigation.navigate(MOBILE_ROUTE_NAMES.WorkspaceInvite, {
                workspaceId,
              })
            }
            accessibilityLabel="Invite member"
          >
            Invite
          </Button>
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
              <Button
                onPress={() =>
                  navigation.navigate(MOBILE_ROUTE_NAMES.WorkspaceInvite, {
                    workspaceId,
                  })
                }
                accessibilityLabel="Invite member"
              >
                Invite member
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Stack gap="md">
          {members.map(member => {
            const isOwner = member.role === 'OWNER';
            const isSelf = member.userId === authUser?.id;
            const canLeaveSelf =
              isSelf && !isOwner && authUser?.id !== workspace?.ownerId;

            return (
              <Stack
                key={member.id}
                gap="sm"
                testID={`mobile-workspace-member-${member.id}`}
              >
                <Text weight="bold">{member.userId}</Text>
                <Text color="textSecondary">Role: {member.role}</Text>
                {canManage && !isOwner ? (
                  <Stack gap="sm">
                    <Text weight="bold" accessibilityRole="text">
                      Change role
                    </Text>
                    <Stack direction="horizontal" gap="sm">
                      {ROLE_OPTIONS.filter(role => role !== 'OWNER').map(
                        role => (
                          <Button
                            key={role}
                            variant={
                              member.role === role ? 'primary' : 'secondary'
                            }
                            disabled={updateState.isLoading}
                            onPress={() => {
                              setActionError(undefined);
                              void updateRole({
                                workspaceId,
                                memberId: member.id,
                                body: { role },
                              })
                                .unwrap()
                                .catch(err => {
                                  setActionError(mapApiError(err).message);
                                });
                            }}
                            accessibilityLabel={`Set role ${role} for ${member.userId}`}
                          >
                            {role}
                          </Button>
                        ),
                      )}
                    </Stack>
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
                            .catch(err => {
                              setActionError(mapApiError(err).message);
                            });
                        }}
                        accessibilityLabel={`Remove ${member.userId}`}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </Stack>
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
                          navigation.navigate(MOBILE_ROUTE_NAMES.Workspaces);
                        })
                        .catch(err => {
                          setActionError(mapApiError(err).message);
                        });
                    }}
                    accessibilityLabel="Leave workspace"
                  >
                    Leave workspace
                  </Button>
                ) : null}
              </Stack>
            );
          })}
        </Stack>
      )}

      <Button
        variant="secondary"
        onPress={() =>
          navigation.navigate(MOBILE_ROUTE_NAMES.WorkspaceDetail, {
            workspaceId,
          })
        }
        accessibilityLabel="Back to workspace"
      >
        Back to workspace
      </Button>
    </Stack>
  );
};
