import { type FC } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  InlineAlert,
  Loader,
  Stack,
  Text,
} from "@nexus/shared-ui";
import { useSelector } from "react-redux";

import { mapApiError } from "../../../hooks/useApiErrorMessage";
import { useWorkspaceSwitch } from "../../../hooks/useWorkspaceSwitch";
import { WEB_ROUTE_PATHS } from "../../../router/paths";
import {
  selectSelectedWorkspaceId,
  selectWorkspaceStatus,
} from "../../../store/slices/workspace/selectors";
import { useListWorkspacesQuery } from "../api";

export const WorkspaceListScreen: FC = () => {
  const selectedId = useSelector(selectSelectedWorkspaceId);
  const workspaceStatus = useSelector(selectWorkspaceStatus);
  const switchWorkspace = useWorkspaceSwitch();
  const { data, error, isLoading, refetch } = useListWorkspacesQuery();

  if (isLoading || workspaceStatus === "loading") {
    return (
      <Stack align="center" padding="xl" gap="md">
        <Loader accessibilityLabel="Loading workspaces" />
        <Text>Loading workspaces…</Text>
      </Stack>
    );
  }

  if (error) {
    const apiError = mapApiError(error);
    return (
      <Stack padding="xl" gap="md">
        <InlineAlert tone="error" title="Unable to load workspaces">
          {apiError.message}
        </InlineAlert>
        {apiError.retryable ? (
          <Button onPress={() => refetch()}>Retry</Button>
        ) : null}
      </Stack>
    );
  }

  const workspaces = data ?? [];

  return (
    <Stack padding="xl" gap="lg" testID="workspace-list-screen">
      <Stack direction="horizontal" justify="space-between" align="center">
        <Text variant="h2">Workspaces</Text>
        <Link to={WEB_ROUTE_PATHS.workspaceCreate}>
          <Button>Create workspace</Button>
        </Link>
      </Stack>

      {workspaces.length === 0 ? (
        <Stack gap="md">
          <Text>No workspaces yet.</Text>
          <Link to={WEB_ROUTE_PATHS.workspaceCreate}>
            <Button>Create your first workspace</Button>
          </Link>
        </Stack>
      ) : (
        <Stack gap="sm">
          {workspaces.map((workspace) => {
            const isSelected = workspace.id === selectedId;
            return (
              <Stack
                key={workspace.id}
                direction="horizontal"
                justify="space-between"
                align="center"
                padding="md"
                gap="md"
              >
                <Stack gap="xs">
                  <Link to={`/workspaces/${workspace.id}`}>
                    <Text weight="bold">{workspace.name}</Text>
                  </Link>
                  <Text>{workspace.description ?? "No description"}</Text>
                  {isSelected ? <Text>Selected workspace</Text> : null}
                </Stack>
                <Button
                  variant={isSelected ? "secondary" : "primary"}
                  disabled={isSelected}
                  onPress={() => switchWorkspace(workspace.id)}
                >
                  {isSelected ? "Current" : "Switch"}
                </Button>
              </Stack>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};
