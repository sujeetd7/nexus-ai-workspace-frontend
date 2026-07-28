import { useState, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  InlineAlert,
  Stack,
  Text,
  View,
  useTheme,
} from "@nexus/shared-ui";
import { useSelector } from "react-redux";

import { mapApiError } from "../../../hooks/useApiErrorMessage";
import { useWorkspaceSwitch } from "../../../hooks/useWorkspaceSwitch";
import { WEB_ROUTE_PATHS } from "../../../router/paths";
import {
  classifySystemFailure,
  workspaceFailureCopy,
} from "../../../system";
import {
  selectSelectedWorkspaceId,
  selectWorkspaceStatus,
} from "../../../store/slices/workspace/selectors";
import { useListWorkspacesQuery } from "../api";

const AVATAR_SIZE = 40;
const SKELETON_ROWS = 3;

/**
 * Canonical Workspace Selection surface (Sprint 5 Batch 5D.1-R2).
 * Visual source: Nexus Design System Figma — Workspace Selection page.
 * Composes only `@nexus/shared-ui` primitives/composites + tokens.
 */
export const WorkspaceListScreen: FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const selectedId = useSelector(selectSelectedWorkspaceId);
  const workspaceStatus = useSelector(selectWorkspaceStatus);
  const switchWorkspace = useWorkspaceSwitch();
  const { data, error, isLoading, isFetching, refetch } =
    useListWorkspacesQuery();
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  if (isLoading || workspaceStatus === "loading") {
    return (
      <Stack
        padding="xl"
        gap="lg"
        testID="workspace-list-loading"
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
              testID={`workspace-list-skeleton-${index}`}
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
                      width: "45%",
                      backgroundColor: theme.semantic.border,
                    }}
                  />
                  <View
                    borderRadius="sm"
                    style={{
                      height: 12,
                      width: "70%",
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
      context: "authenticated",
    });
    const copy = workspaceFailureCopy(presentation.kind, apiError.message);
    const busy = retrying || isFetching;

    return (
      <Stack padding="xl" gap="md" testID="workspace-list-error">
        <WorkspaceBrand />
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
            accessibilityLabel="Retry loading workspaces"
          >
            Retry
          </Button>
        ) : null}
        {presentation.primaryAction === "signIn" ? (
          <Link to={WEB_ROUTE_PATHS.login}>
            <Button accessibilityLabel="Sign in">Sign in</Button>
          </Link>
        ) : null}
      </Stack>
    );
  }

  const workspaces = data ?? [];
  const busy = Boolean(switchingId) || isFetching;

  return (
    <Stack
      padding="xl"
      gap="lg"
      testID="workspace-list-screen"
      accessibilityLabel="Workspace selection"
    >
      <WorkspaceBrand />

      <Stack direction="horizontal" justify="space-between" align="center" gap="md">
        <Stack gap="xs" flex={1}>
          <Text variant="h2" accessibilityRole="heading">
            Select a workspace
          </Text>
          <Text color="textSecondary">
            Choose the workspace you want to use in Nexus.
          </Text>
        </Stack>
        <Link to={WEB_ROUTE_PATHS.workspaceCreate}>
          <Button variant="secondary" accessibilityLabel="Create workspace">
            Create workspace
          </Button>
        </Link>
      </Stack>

      {workspaces.length === 0 ? (
        <Card
          elevation="sm"
          padding="lg"
          testID="workspace-list-empty"
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
                alignItems: "center",
                justifyContent: "center",
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
                Create a workspace to enter the application shell.
              </Text>
            </Stack>
            <Link to={WEB_ROUTE_PATHS.workspaceCreate}>
              <Button accessibilityLabel="Create your first workspace">
                Create your first workspace
              </Button>
            </Link>
          </Stack>
        </Card>
      ) : (
        <Stack gap="sm" accessibilityRole="list">
          {workspaces.map((workspace) => {
            const isSelected = workspace.id === selectedId;
            const isSwitching = switchingId === workspace.id;
            const initial =
              workspace.name.trim().charAt(0).toUpperCase() || "W";

            return (
              <Card
                key={workspace.id}
                elevation={isSelected ? "md" : "sm"}
                padding="md"
                testID={`workspace-row-${workspace.id}`}
                accessibilityLabel={`${workspace.name}${isSelected ? ", selected" : ""}`}
                accessibilityRole="listitem"
                header={
                  <Stack
                    direction="horizontal"
                    justify="space-between"
                    align="center"
                    gap="md"
                  >
                    <Stack direction="horizontal" align="center" gap="md" flex={1}>
                      <View
                        background="surface"
                        borderRadius="md"
                        minWidth={AVATAR_SIZE}
                        minHeight={AVATAR_SIZE}
                        accessibilityLabel={`${workspace.name} avatar`}
                        style={{
                          width: AVATAR_SIZE,
                          height: AVATAR_SIZE,
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: isSelected
                            ? theme.semantic.primary
                            : theme.semantic.border,
                        }}
                      >
                        <Text weight="bold">{initial}</Text>
                      </View>
                      <Stack gap="xs" flex={1}>
                        <Link to={`/workspaces/${workspace.id}`}>
                          <Text weight="bold">{workspace.name}</Text>
                        </Link>
                        <Text color="textSecondary">
                          {workspace.description ?? "No description"}
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
                      variant={isSelected ? "secondary" : "primary"}
                      disabled={isSelected || busy}
                      accessibilityLabel={
                        isSelected
                          ? `${workspace.name} is the current workspace`
                          : `Switch to ${workspace.name}`
                      }
                      onPress={() => {
                        setSwitchingId(workspace.id);
                        void switchWorkspace(workspace.id).finally(() => {
                          setSwitchingId(null);
                        });
                      }}
                    >
                      {isSwitching
                        ? "Switching…"
                        : isSelected
                          ? "Current"
                          : "Switch"}
                    </Button>
                  </Stack>
                }
              />
            );
          })}
        </Stack>
      )}

      {selectedId ? (
        <Stack direction="horizontal" justify="end">
          <Button
            accessibilityLabel="Continue to dashboard"
            onPress={() => navigate(WEB_ROUTE_PATHS.dashboard)}
          >
            Continue
          </Button>
        </Stack>
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
      testID="workspace-list-brand"
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
          alignItems: "center",
          justifyContent: "center",
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
