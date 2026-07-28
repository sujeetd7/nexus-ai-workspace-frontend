import type { FC } from "react";

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

export type WorkspaceSelectionState =
  | "default"
  | "loading"
  | "empty"
  | "multiple"
  | "single"
  | "selected"
  | "unauthorized"
  | "forbidden"
  | "retry"
  | "apiError";

export interface WorkspaceSelectionCompositionProps {
  state?: WorkspaceSelectionState;
}

interface MockWorkspace {
  id: string;
  name: string;
  description?: string;
}

const MOCK_WORKSPACES: MockWorkspace[] = [
  {
    id: "ws-1",
    name: "Alpha Labs",
    description: "Product and platform engineering",
  },
  {
    id: "ws-2",
    name: "Beta Studio",
    description: "Design systems and UX research",
  },
  {
    id: "ws-3",
    name: "Gamma Ops",
  },
];

const AVATAR_SIZE = 40;

/**
 * Storybook-only Workspace Selection composition — mock local state, no API.
 * Mirrors web `WorkspaceListScreen` visual contract (5D.1-R2).
 */
export const WorkspaceSelectionComposition: FC<
  WorkspaceSelectionCompositionProps
> = ({ state = "default" }) => {
  const { theme } = useTheme();

  if (state === "loading") {
    return (
      <Stack
        padding="xl"
        gap="lg"
        testID="workspace-selection-loading"
        accessibilityLabel="Loading workspaces"
      >
        <Brand />
        <Header showCreate />
        <Stack gap="sm">
          {[0, 1, 2].map((index) => (
            <Card
              key={index}
              elevation="sm"
              padding="md"
              testID={`workspace-selection-skeleton-${index}`}
            >
              <Stack direction="horizontal" align="center" gap="md">
                <View
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

  if (state === "unauthorized") {
    return (
      <Stack padding="xl" gap="md" testID="workspace-selection-unauthorized">
        <Brand />
        <InlineAlert tone="error" title="Session expired">
          Your session has expired. Sign in again to continue.
        </InlineAlert>
        <Button accessibilityLabel="Sign in">Sign in</Button>
      </Stack>
    );
  }

  if (state === "forbidden") {
    return (
      <Stack padding="xl" gap="md" testID="workspace-selection-forbidden">
        <Brand />
        <InlineAlert tone="error" title="Permission denied">
          You do not have permission to view workspaces.
        </InlineAlert>
      </Stack>
    );
  }

  if (state === "retry" || state === "apiError") {
    return (
      <Stack padding="xl" gap="md" testID="workspace-selection-error">
        <Brand />
        <InlineAlert tone="error" title="Unable to load workspaces">
          {state === "retry"
            ? "A temporary error occurred. Please try again."
            : "Unexpected API error while loading workspaces."}
        </InlineAlert>
        <Button accessibilityLabel="Retry loading workspaces">Retry</Button>
      </Stack>
    );
  }

  const selectedId =
    state === "selected" || state === "default" || state === "multiple"
      ? "ws-1"
      : state === "single"
        ? "ws-1"
        : undefined;

  const workspaces =
    state === "empty"
      ? []
      : state === "single"
        ? [MOCK_WORKSPACES[0]]
        : state === "multiple" || state === "selected" || state === "default"
          ? MOCK_WORKSPACES
          : MOCK_WORKSPACES;

  return (
    <Stack
      padding="xl"
      gap="lg"
      testID="workspace-selection-screen"
      accessibilityLabel="Workspace selection"
    >
      <Brand />
      <Header showCreate />

      {workspaces.length === 0 ? (
        <Card
          elevation="sm"
          padding="lg"
          testID="workspace-selection-empty"
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
            <Button accessibilityLabel="Create your first workspace">
              Create your first workspace
            </Button>
          </Stack>
        </Card>
      ) : (
        <Stack gap="sm" accessibilityRole="list">
          {workspaces.map((workspace) => {
            const isSelected = workspace.id === selectedId;
            const initial =
              workspace.name.trim().charAt(0).toUpperCase() || "W";

            return (
              <Card
                key={workspace.id}
                elevation={isSelected ? "md" : "sm"}
                padding="md"
                testID={`workspace-selection-row-${workspace.id}`}
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
                        <Text weight="bold">{workspace.name}</Text>
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
                      disabled={isSelected}
                      accessibilityLabel={
                        isSelected
                          ? `${workspace.name} is the current workspace`
                          : `Switch to ${workspace.name}`
                      }
                    >
                      {isSelected ? "Current" : "Switch"}
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
          <Button accessibilityLabel="Continue to dashboard">Continue</Button>
        </Stack>
      ) : null}
    </Stack>
  );
};

const Brand: FC = () => {
  const { theme } = useTheme();

  return (
    <Stack
      direction="horizontal"
      align="center"
      gap="sm"
      testID="workspace-selection-brand"
      accessibilityLabel="Nexus"
    >
      <View
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

const Header: FC<{ showCreate?: boolean }> = ({ showCreate = true }) => (
  <Stack direction="horizontal" justify="space-between" align="center" gap="md">
    <Stack gap="xs" flex={1}>
      <Text variant="h2" accessibilityRole="heading">
        Select a workspace
      </Text>
      <Text color="textSecondary">
        Choose the workspace you want to use in Nexus.
      </Text>
    </Stack>
    {showCreate ? (
      <Button variant="secondary" accessibilityLabel="Create workspace">
        Create workspace
      </Button>
    ) : null}
  </Stack>
);
