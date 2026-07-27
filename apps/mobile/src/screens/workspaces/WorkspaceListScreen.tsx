import { type FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, InlineAlert, Loader, Stack, Text } from '@nexus/shared-ui';

import { useListWorkspacesQuery } from '../../api/services/workspace/workspaceApi';
import type { AppDispatch } from '../../store/createAppStore';
import { selectUser } from '../../store/slices/auth/selectors';
import {
  selectSelectedWorkspaceId,
  selectWorkspaceStatus,
} from '../../store/slices/workspace/selectors';
import { setSelectedWorkspace } from '../../store/slices/workspace/workspaceSlice';
import { createMobileSelectedWorkspaceStorage } from '../../platform/workspace/createMobileSelectedWorkspaceStorage';

const workspaceStorage = createMobileSelectedWorkspaceStorage();

export const WorkspaceListScreen: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authUser = useSelector(selectUser);
  const selectedId = useSelector(selectSelectedWorkspaceId);
  const workspaceStatus = useSelector(selectWorkspaceStatus);
  const { data, error, isLoading, refetch } = useListWorkspacesQuery();

  if (isLoading || workspaceStatus === 'loading') {
    return <Loader accessibilityLabel="Loading workspaces" />;
  }

  if (error) {
    return (
      <Stack padding="xl" gap="md">
        <InlineAlert tone="error" title="Unable to load workspaces">
          Failed to load workspaces.
        </InlineAlert>
        <Button onPress={() => refetch()}>Retry</Button>
      </Stack>
    );
  }

  const workspaces = data ?? [];

  return (
    <Stack padding="xl" gap="md" testID="mobile-workspace-list-screen">
      <Text variant="h2">Workspaces</Text>
      {workspaces.length === 0 ? <Text>No workspaces yet.</Text> : null}
      {workspaces.map(workspace => {
        const isSelected = workspace.id === selectedId;
        return (
          <Stack key={workspace.id} gap="xs">
            <Text weight="bold">{workspace.name}</Text>
            <Text>{workspace.description ?? 'No description'}</Text>
            <Button
              disabled={isSelected}
              onPress={async () => {
                await workspaceStorage.setSelectedWorkspaceId(workspace.id);
                dispatch(setSelectedWorkspace(workspace.id));
              }}
            >
              {isSelected ? 'Current workspace' : 'Switch workspace'}
            </Button>
          </Stack>
        );
      })}
      {authUser ? (
        <Text>Signed in as {authUser.email}</Text>
      ) : null}
    </Stack>
  );
};
