import { useState, type FC } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Badge,
  Button,
  Card,
  InlineAlert,
  Stack,
  Text,
  View,
  useTheme,
} from '@nexus/shared-ui';
import { useSelector, useDispatch } from 'react-redux';

import { useListWorkspacesQuery } from '../../api/services/workspace/workspaceApi';
import { mapApiError } from '../../hooks/useApiErrorMessage';
import { useWorkspaceSwitch } from '../../hooks/useWorkspaceSwitch';
import type { RootStackParamList } from '../../navigation/types';
import { MOBILE_ROUTE_NAMES } from '../../navigation/types';
import {
  classifySystemFailure,
  workspaceFailureCopy,
} from '../../system';
import type { AppDispatch } from '../../store/createAppStore';
import { sessionExpiredAcknowledged } from '../../store/slices/auth/authSlice';
import {
  selectSelectedWorkspaceId,
  selectWorkspaceStatus,
} from '../../store/slices/workspace/selectors';

/** Native touch target / avatar — ≥44pt (not a shrink of web 40px). */
const AVATAR_SIZE = 44;
const SKELETON_ROWS = 3;

/**
 * Native Workspace Selection — visual parity with web canonical Figma,
 * adapted for safe-area shell, vertical stacking, and ≥44pt targets.
 */
export const WorkspaceListScreen: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const selectedId = useSelector(selectSelectedWorkspaceId);
  const workspaceStatus = useSelector(selectWorkspaceStatus);
  const switchWorkspace = useWorkspaceSwitch();
  const { data, error, isLoading, isFetching, refetch } =
    useListWorkspacesQuery();
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  if (isLoading || workspaceStatus === 'loading') {
    return (
      <Stack
        padding="xl"
        gap="md"
        testID="mobile-workspace-list-loading"
        accessibilityLabel="Loading workspaces"
      >
        <WorkspaceBrand />
        <Stack gap="xs">
          <Text variant="h2" accessibilityRole="heading">
            Select a workspace
          </Text>
          <Text color="textSecondary">
            Choose the workspace you want to use in Nexus.
          </Text>
        </Stack>
        <Stack gap="sm" accessibilityLabel="Loading workspace list">
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <Card
              key={`skeleton-${index}`}
              elevation="sm"
              padding="md"
              testID={`mobile-workspace-list-skeleton-${index}`}
              accessibilityLabel="Loading workspace"
            >
              <Stack direction="horizontal" align="center" gap="md">
                <View
                  background="surface"
                  borderRadius="md"
                  minWidth={AVATAR_SIZE}
                  minHeight={AVATAR_SIZE}
                  style={{
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE,
                    backgroundColor: theme.semantic.border,
                  }}
                />
                <Stack gap="sm" flex={1}>
                  <View
                    borderRadius="sm"
                    style={{
                      height: 16,
                      width: '50%',
                      backgroundColor: theme.semantic.border,
                    }}
                  />
                  <View
                    borderRadius="sm"
                    style={{
                      height: 12,
                      width: '75%',
                      backgroundColor: theme.semantic.border,
                    }}
                  />
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>
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
      <Stack padding="xl" gap="md" testID="mobile-workspace-list-error">
        <WorkspaceBrand />
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
            accessibilityLabel="Retry loading workspaces"
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

  const workspaces = data ?? [];
  const busy = Boolean(switchingId) || isFetching;

  return (
    <Stack
      padding="xl"
      gap="md"
      testID="mobile-workspace-list-screen"
      accessibilityLabel="Workspace selection"
    >
      <WorkspaceBrand />

      <Stack gap="xs">
        <Text variant="h2" accessibilityRole="heading">
          Select a workspace
        </Text>
        <Text color="textSecondary">
          Choose the workspace you want to use in Nexus.
        </Text>
      </Stack>

      {workspaces.length === 0 ? (
        <Card
          elevation="sm"
          padding="lg"
          testID="mobile-workspace-list-empty"
          accessibilityLabel="No workspaces"
        >
          <Stack gap="md" align="center">
            <View
              background="surface"
              borderRadius="pill"
              minWidth={72}
              minHeight={72}
              accessibilityLabel="Empty workspaces illustration"
              style={{
                width: 72,
                height: 72,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: theme.semantic.border,
              }}
            >
              <Text variant="h3" color="textSecondary" weight="bold">
                W
              </Text>
            </View>
            <Stack gap="xs" align="center">
              <Text weight="bold" accessibilityRole="heading">
                No workspaces yet
              </Text>
              <Text color="textSecondary" align="center">
                Ask an administrator to invite you, or create a workspace from
                web when available.
              </Text>
            </Stack>
          </Stack>
        </Card>
      ) : (
        <Stack gap="sm">
          {workspaces.map(workspace => {
            const isSelected = workspace.id === selectedId;
            const isSwitching = switchingId === workspace.id;
            const initial =
              workspace.name.trim().charAt(0).toUpperCase() || 'W';

            return (
              <Card
                key={workspace.id}
                elevation={isSelected ? 'md' : 'sm'}
                padding="md"
                testID={`mobile-workspace-row-${workspace.id}`}
                accessibilityLabel={`${workspace.name}${isSelected ? ', selected' : ''}`}
                header={
                  <Stack gap="md">
                    <Stack direction="horizontal" align="center" gap="md">
                      <View
                        background="surface"
                        borderRadius="md"
                        minWidth={AVATAR_SIZE}
                        minHeight={AVATAR_SIZE}
                        accessibilityLabel={`${workspace.name} avatar`}
                        style={{
                          width: AVATAR_SIZE,
                          height: AVATAR_SIZE,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 1,
                          borderColor: isSelected
                            ? theme.semantic.primary
                            : theme.semantic.border,
                        }}
                      >
                        <Text weight="bold">{initial}</Text>
                      </View>
                      <Stack gap="xs" flex={1}>
                        <Text weight="bold">{workspace.name}</Text>
                        <Text color="textSecondary">
                          {workspace.description ?? 'No description'}
                        </Text>
                        {isSelected ? (
                          <Badge
                            variant="primary"
                            size="sm"
                            accessibilityLabel="Selected workspace"
                          >
                            Selected
                          </Badge>
                        ) : null}
                      </Stack>
                    </Stack>
                    <Button
                      variant={isSelected ? 'secondary' : 'primary'}
                      disabled={isSelected || busy}
                      accessibilityLabel={
                        isSelected
                          ? `${workspace.name} is the current workspace`
                          : `Switch to ${workspace.name}`
                      }
                      onPress={() => {
                        setSwitchingId(workspace.id);
                        void switchWorkspace(workspace.id)
                          .then(() => {
                            navigation.navigate(MOBILE_ROUTE_NAMES.Dashboard);
                          })
                          .finally(() => {
                            setSwitchingId(null);
                          });
                      }}
                    >
                      {isSwitching
                        ? 'Switching…'
                        : isSelected
                          ? 'Current workspace'
                          : 'Use workspace'}
                    </Button>
                  </Stack>
                }
              />
            );
          })}
        </Stack>
      )}

      {selectedId ? (
        <Button
          accessibilityLabel="Continue to dashboard"
          onPress={() => navigation.navigate(MOBILE_ROUTE_NAMES.Dashboard)}
        >
          Continue
        </Button>
      ) : null}
    </Stack>
  );
};

const WorkspaceBrand: FC = () => {
  const { theme } = useTheme();

  return (
    <Stack
      direction="horizontal"
      align="center"
      gap="sm"
      testID="mobile-workspace-list-brand"
      accessibilityLabel="Nexus"
    >
      <View
        background="surface"
        borderRadius="md"
        minWidth={32}
        minHeight={32}
        accessibilityLabel="Nexus logo"
        style={{
          width: 32,
          height: 32,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.semantic.primary,
        }}
      >
        <Text weight="bold" color="onPrimary">
          N
        </Text>
      </View>
      <Text variant="h3" weight="bold">
        Nexus
      </Text>
    </Stack>
  );
};
