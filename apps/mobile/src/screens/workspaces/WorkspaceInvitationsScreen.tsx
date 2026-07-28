import { useState, type FC } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Button,
  EmptyState,
  FormField,
  InlineAlert,
  Loader,
  Stack,
  Text,
} from '@nexus/shared-ui';
import type { WorkspaceRole } from '@nexus/shared-types';
import { inviteMemberSchema } from '@nexus/shared-validation';
import { useDispatch, useSelector } from 'react-redux';

import {
  useCreateInvitationMutation,
  useDeleteInvitationMutation,
  useGetWorkspaceQuery,
  useListInvitationsQuery,
} from '../../api/services/workspace/workspaceApi';
import { mapApiError } from '../../hooks/useApiErrorMessage';
import { useValidatedForm } from '../../hooks/useValidatedForm';
import type { RootStackParamList } from '../../navigation/types';
import { MOBILE_ROUTE_NAMES } from '../../navigation/types';
import type { AppDispatch } from '../../store/createAppStore';
import { sessionExpiredAcknowledged } from '../../store/slices/auth/authSlice';
import { selectUser } from '../../store/slices/auth/selectors';
import {
  classifySystemFailure,
  workspaceFailureCopy,
} from '../../system';

type InvitationsRoute = RouteProp<RootStackParamList, 'WorkspaceInvitations'>;
type InviteRoute = RouteProp<RootStackParamList, 'WorkspaceInvite'>;

export const WorkspaceInvitationsScreen: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<InvitationsRoute>();
  const workspaceId = route.params?.workspaceId ?? '';
  const dispatch = useDispatch<AppDispatch>();
  const authUser = useSelector(selectUser);
  const { data: workspace } = useGetWorkspaceQuery(workspaceId, {
    skip: !workspaceId,
  });
  const { data, error, isLoading, isFetching, refetch } =
    useListInvitationsQuery(workspaceId, { skip: !workspaceId });
  const [deleteInvitation, deleteState] = useDeleteInvitationMutation();
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
        testID="mobile-workspace-invitations-loading"
        accessibilityLabel="Loading invitations"
      >
        <Loader accessibilityLabel="Loading invitations" />
        <Text>Loading invitations…</Text>
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
      <Stack padding="xl" gap="md" testID="mobile-workspace-invitations-error">
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
            accessibilityLabel="Retry loading invitations"
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

  const invitations = data ?? [];
  const canManage =
    authUser?.id === workspace?.ownerId ||
    authUser?.role === 'ADMIN' ||
    authUser?.role === 'MANAGER';

  return (
    <Stack padding="xl" gap="lg" testID="mobile-workspace-invitations-screen">
      <Stack
        direction="horizontal"
        justify="space-between"
        align="center"
        gap="md"
      >
        <Text variant="h2" accessibilityRole="heading">
          Invitations
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
        <InlineAlert tone="error" title="Unable to update invitation">
          {actionError}
        </InlineAlert>
      ) : null}

      {invitations.length === 0 ? (
        <EmptyState
          title="No invitations"
          description="Pending invitations will appear here."
        />
      ) : (
        <Stack gap="md">
          {invitations.map(invitation => (
            <Stack
              key={invitation.id}
              gap="sm"
              testID={`mobile-workspace-invitation-${invitation.id}`}
            >
              <Text weight="bold">{invitation.email}</Text>
              <Text color="textSecondary">
                {invitation.role} · {invitation.status}
              </Text>
              {canManage && invitation.status === 'PENDING' ? (
                <Button
                  variant="secondary"
                  loading={deleteState.isLoading}
                  onPress={() => {
                    setActionError(undefined);
                    void deleteInvitation(invitation.id)
                      .unwrap()
                      .catch(err => {
                        setActionError(mapApiError(err).message);
                      });
                  }}
                  accessibilityLabel={`Cancel invitation for ${invitation.email}`}
                >
                  Cancel
                </Button>
              ) : null}
            </Stack>
          ))}
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

export const InviteMemberScreen: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<InviteRoute>();
  const workspaceId = route.params?.workspaceId ?? '';
  const authUser = useSelector(selectUser);
  const [createInvitation, createState] = useCreateInvitationMutation();

  const form = useValidatedForm<{
    email: string;
    invitedBy: string;
    role: WorkspaceRole;
  }>({
    schema: inviteMemberSchema,
    initialValues: {
      email: '',
      invitedBy: authUser?.id ?? '',
      role: 'DEVELOPER',
    },
  });

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

  const onSubmit = async () => {
    if (!authUser || !form.validate()) {
      return;
    }

    try {
      await createInvitation({
        workspaceId,
        body: {
          email: form.values.email,
          invitedBy: authUser.id,
          role: form.values.role,
        },
      }).unwrap();
      form.reset();
      navigation.navigate(MOBILE_ROUTE_NAMES.WorkspaceInvitations, {
        workspaceId,
      });
    } catch {
      // surfaced below
    }
  };

  const mutationError = createState.error
    ? mapApiError(createState.error).message
    : undefined;

  return (
    <Stack padding="xl" gap="lg" testID="mobile-invite-member-screen">
      <Text variant="h2" accessibilityRole="heading">
        Invite member
      </Text>
      {mutationError ? (
        <InlineAlert tone="error" title="Unable to send invitation">
          {mutationError}
        </InlineAlert>
      ) : null}
      {createState.isSuccess ? (
        <InlineAlert tone="success" title="Invitation sent">
          The invitation was created successfully.
        </InlineAlert>
      ) : null}
      <FormField
        label="Email"
        value={form.values.email}
        onChangeText={value => form.setField('email', value)}
        errorText={form.fieldErrors.email}
        required
        accessibilityLabel="Invitee email"
      />
      <Text weight="bold">Role</Text>
      <Stack direction="horizontal" gap="sm">
        {(['ADMIN', 'DEVELOPER', 'VIEWER'] as WorkspaceRole[]).map(role => (
          <Button
            key={role}
            variant={form.values.role === role ? 'primary' : 'secondary'}
            onPress={() => form.setField('role', role)}
            accessibilityLabel={`Invite as ${role}`}
          >
            {role}
          </Button>
        ))}
      </Stack>
      <Button
        loading={createState.isLoading}
        onPress={() => {
          void onSubmit();
        }}
        accessibilityLabel="Send invitation"
      >
        Send invitation
      </Button>
      <Button
        variant="secondary"
        onPress={() =>
          navigation.navigate(MOBILE_ROUTE_NAMES.WorkspaceInvitations, {
            workspaceId,
          })
        }
        accessibilityLabel="Back to invitations"
      >
        Back
      </Button>
    </Stack>
  );
};
