import { useState, type FC } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import {
  Button,
  EmptyState,
  FormField,
  InlineAlert,
  Loader,
  Stack,
  Text,
} from '@nexus/shared-ui';
import type { Workspace } from '@nexus/shared-types';
import { updateWorkspaceSchema } from '@nexus/shared-validation';
import { useDispatch, useSelector } from 'react-redux';

import {
  useGetWorkspaceQuery,
  useListMembersQuery,
  useRemoveMemberMutation,
  useUpdateWorkspaceMutation,
} from '../../api/services/workspace/workspaceApi';
import { mapApiError } from '../../hooks/useApiErrorMessage';
import { useValidatedForm } from '../../hooks/useValidatedForm';
import type { RootStackParamList } from '../../navigation/types';
import { MOBILE_ROUTE_NAMES } from '../../navigation/types';
import { createMobileSelectedWorkspaceStorage } from '../../platform/workspace/createMobileSelectedWorkspaceStorage';
import type { AppDispatch } from '../../store/createAppStore';
import { sessionExpiredAcknowledged } from '../../store/slices/auth/authSlice';
import { selectUser } from '../../store/slices/auth/selectors';
import {
  clearSelectedWorkspace,
} from '../../store/slices/workspace/workspaceSlice';
import {
  selectSelectedWorkspaceId,
} from '../../store/slices/workspace/selectors';
import {
  classifySystemFailure,
  workspaceFailureCopy,
} from '../../system';

const workspaceStorage = createMobileSelectedWorkspaceStorage();

type DetailRoute = RouteProp<RootStackParamList, 'WorkspaceDetail'>;

const WorkspaceSettingsForm: FC<{
  readonly workspace: Workspace;
}> = ({ workspace }) => {
  const [updateWorkspace, updateState] = useUpdateWorkspaceMutation();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  const form = useValidatedForm<{
    name?: string;
    description?: string;
  }>({
    schema: updateWorkspaceSchema,
    initialValues: {
      name: workspace.name,
      description: workspace.description ?? '',
    },
  });

  const onSubmit = async () => {
    setSuccessMessage(undefined);
    if (!form.validate()) {
      return;
    }

    try {
      await updateWorkspace({
        id: workspace.id,
        body: {
          name: form.values.name || undefined,
          description: form.values.description || undefined,
        },
      }).unwrap();
      setSuccessMessage('Workspace updated.');
    } catch {
      // surfaced below
    }
  };

  const mutationError = updateState.error
    ? mapApiError(updateState.error).message
    : undefined;

  return (
    <Stack gap="md" testID="mobile-workspace-settings-form">
      <Text variant="h3" accessibilityRole="heading">
        Workspace settings
      </Text>
      {successMessage ? (
        <InlineAlert tone="success" title="Saved">
          {successMessage}
        </InlineAlert>
      ) : null}
      {mutationError ? (
        <InlineAlert tone="error" title="Unable to update workspace">
          {mutationError}
        </InlineAlert>
      ) : null}
      <FormField
        label="Name"
        value={form.values.name}
        onChangeText={value => form.setField('name', value)}
        errorText={form.fieldErrors.name}
        accessibilityLabel="Workspace name"
      />
      <FormField
        label="Description"
        value={form.values.description}
        onChangeText={value => form.setField('description', value)}
        accessibilityLabel="Workspace description"
      />
      <Button
        loading={updateState.isLoading}
        onPress={() => {
          void onSubmit();
        }}
        accessibilityLabel="Save workspace changes"
      >
        Save changes
      </Button>
    </Stack>
  );
};

export const WorkspaceDetailScreen: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<DetailRoute>();
  const workspaceId = route.params?.workspaceId ?? '';
  const dispatch = useDispatch<AppDispatch>();
  const authUser = useSelector(selectUser);
  const selectedId = useSelector(selectSelectedWorkspaceId);
  const { data, error, isLoading, isFetching, refetch } = useGetWorkspaceQuery(
    workspaceId,
    { skip: !workspaceId },
  );
  const { data: members } = useListMembersQuery(workspaceId, {
    skip: !workspaceId,
  });
  const [removeMember, removeState] = useRemoveMemberMutation();
  const [retrying, setRetrying] = useState(false);
  const [leaveError, setLeaveError] = useState<string | undefined>();

  if (!workspaceId) {
    return (
      <Stack padding="xl" gap="md" testID="mobile-workspace-detail-missing">
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
        testID="mobile-workspace-detail-loading"
        accessibilityLabel="Loading workspace"
      >
        <Loader accessibilityLabel="Loading workspace" />
        <Text>Loading workspace…</Text>
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
      <Stack padding="xl" gap="md" testID="mobile-workspace-detail-error">
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
            accessibilityLabel="Retry loading workspace"
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

  if (!data) {
    return (
      <Stack padding="xl" gap="md" testID="mobile-workspace-detail-empty">
        <EmptyState
          title="Workspace not found"
          description="This workspace may have been removed or you no longer have access."
        />
        <Button
          variant="secondary"
          onPress={() => navigation.navigate(MOBILE_ROUTE_NAMES.Workspaces)}
          accessibilityLabel="Back to workspaces"
        >
          All workspaces
        </Button>
      </Stack>
    );
  }

  const canEdit =
    authUser?.id === data.ownerId ||
    authUser?.role === 'ADMIN' ||
    authUser?.role === 'MANAGER';

  const selfMember = members?.find(member => member.userId === authUser?.id);
  const canLeave =
    selfMember != null &&
    selfMember.role !== 'OWNER' &&
    authUser?.id !== data.ownerId;

  const onLeave = async () => {
    if (!selfMember) {
      return;
    }
    setLeaveError(undefined);
    try {
      await removeMember({
        workspaceId,
        memberId: selfMember.id,
      }).unwrap();
      if (selectedId === workspaceId) {
        await workspaceStorage.clearSelectedWorkspaceId();
        dispatch(clearSelectedWorkspace());
      }
      navigation.navigate(MOBILE_ROUTE_NAMES.Workspaces);
    } catch (leaveErr) {
      setLeaveError(mapApiError(leaveErr).message);
    }
  };

  return (
    <Stack padding="xl" gap="lg" testID="mobile-workspace-detail-screen">
      <Text variant="h2" accessibilityRole="heading">
        {data.name}
      </Text>
      <Text color="textSecondary">Slug: {data.slug}</Text>
      <Text>Status: {data.status}</Text>
      <Text color="textSecondary">
        {data.description ?? 'No description'}
      </Text>

      <Stack gap="sm">
        <Button
          variant="secondary"
          onPress={() =>
            navigation.navigate(MOBILE_ROUTE_NAMES.WorkspaceMembers, {
              workspaceId,
            })
          }
          accessibilityLabel="View members"
        >
          Members
        </Button>
        <Button
          variant="secondary"
          onPress={() =>
            navigation.navigate(MOBILE_ROUTE_NAMES.WorkspaceInvitations, {
              workspaceId,
            })
          }
          accessibilityLabel="View invitations"
        >
          Invitations
        </Button>
        <Button
          variant="secondary"
          onPress={() => navigation.navigate(MOBILE_ROUTE_NAMES.Workspaces)}
          accessibilityLabel="Back to workspaces"
        >
          All workspaces
        </Button>
      </Stack>

      {canEdit ? (
        <WorkspaceSettingsForm key={data.updatedAt} workspace={data} />
      ) : (
        <InlineAlert tone="info" title="View only">
          You do not have permission to edit this workspace.
        </InlineAlert>
      )}

      {canLeave ? (
        <Stack gap="sm">
          {leaveError ? (
            <InlineAlert tone="error" title="Unable to leave workspace">
              {leaveError}
            </InlineAlert>
          ) : null}
          <Button
            variant="secondary"
            loading={removeState.isLoading}
            onPress={() => {
              void onLeave();
            }}
            accessibilityLabel="Leave workspace"
          >
            Leave workspace
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
};
