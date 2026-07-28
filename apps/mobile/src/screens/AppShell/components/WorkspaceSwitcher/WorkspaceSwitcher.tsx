import type { FC } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Avatar,
  IconButton,
  ListRow,
  Stack,
  Text,
  View,
} from '@nexus/shared-ui';
import { useSelector } from 'react-redux';

import { useListWorkspacesQuery } from '../../../../api/services/workspace/workspaceApi';
import { useWorkspaceSwitch } from '../../../../hooks/useWorkspaceSwitch';
import type { RootStackParamList } from '../../../../navigation/types';
import { MOBILE_ROUTE_NAMES } from '../../../../navigation/types';
import { selectSelectedWorkspaceId } from '../../../../store/slices/workspace/selectors';

export interface WorkspaceSwitcherProps {
  readonly compact?: boolean;
  readonly onNavigate?: () => void;
  readonly testID?: string;
}

/**
 * Workspace switcher — reuses WorkspaceBootstrap selection state only.
 */
export const WorkspaceSwitcher: FC<WorkspaceSwitcherProps> = ({
  compact = false,
  onNavigate,
  testID = 'mobile-app-shell-workspace-switcher',
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const selectedId = useSelector(selectSelectedWorkspaceId);
  const switchWorkspace = useWorkspaceSwitch();
  const { data: workspaces } = useListWorkspacesQuery(undefined, {
    skip: !selectedId,
  });

  const selectedWorkspace = workspaces?.find(
    (workspace) => workspace.id === selectedId,
  );
  const label = selectedWorkspace?.name ?? 'Select workspace';
  const initial =
    selectedWorkspace?.name.trim().charAt(0).toUpperCase() || 'W';

  const openWorkspaces = () => {
    onNavigate?.();
    navigation.navigate(MOBILE_ROUTE_NAMES.Workspaces);
  };

  if (!selectedId) {
    return (
      <ListRow
        leading={
          <Avatar
            initials="?"
            size="sm"
            accessibilityLabel="No workspace selected"
          />
        }
        title="Select workspace"
        subtitle="Choose a workspace to continue"
        accessibilityLabel="Select workspace"
        onPress={openWorkspaces}
        testID={`${testID}-select`}
      />
    );
  }

  if (compact) {
    return (
      <Stack direction="horizontal" gap="sm" align="center" testID={testID}>
        <Avatar initials={initial} size="sm" accessibilityLabel={label} />
        <Text variant="body" weight="medium">
          {label}
        </Text>
        <IconButton
          accessibilityLabel="Switch workspace"
          onPress={openWorkspaces}
          testID={`${testID}-switch`}
        >
          <Text variant="caption">⇄</Text>
        </IconButton>
      </Stack>
    );
  }

  return (
    <View testID={testID}>
      <Stack gap="xs">
        <ListRow
          leading={
            <Avatar initials={initial} size="sm" accessibilityLabel={label} />
          }
          title={label}
          subtitle="Current workspace"
          trailing={
            <Text variant="caption" color="textSecondary">
              Switch
            </Text>
          }
          accessibilityLabel={`Current workspace: ${label}. Switch workspace.`}
          onPress={openWorkspaces}
          testID={`${testID}-current`}
        />
        {workspaces && workspaces.length > 1
          ? workspaces
              .filter((workspace) => workspace.id !== selectedId)
              .slice(0, 3)
              .map((workspace) => {
                const wsInitial =
                  workspace.name.trim().charAt(0).toUpperCase() || 'W';
                return (
                  <ListRow
                    key={workspace.id}
                    leading={
                      <Avatar
                        initials={wsInitial}
                        size="sm"
                        accessibilityLabel={workspace.name}
                      />
                    }
                    title={workspace.name}
                    onPress={() => {
                      onNavigate?.();
                      void switchWorkspace(workspace.id);
                    }}
                    accessibilityLabel={`Switch to ${workspace.name}`}
                    testID={`${testID}-option-${workspace.id}`}
                  />
                );
              })
          : null}
      </Stack>
    </View>
  );
};
