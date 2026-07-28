import type { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Stack, Text } from '@nexus/shared-ui';

import { getMobileSession } from '../../api/client/axios';
import type { AppDispatch } from '../../store/createAppStore';
import { logoutCompleted } from '../../store/slices/auth/authSlice';
import { selectUser } from '../../store/slices/auth/selectors';
import { selectSelectedWorkspaceId } from '../../store/slices/workspace/selectors';

export const DashboardScreen: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const selectedWorkspaceId = useSelector(selectSelectedWorkspaceId);

  return (
    <Stack gap="md" padding="md" testID="mobile-dashboard-screen">
      <Text variant="h2" accessibilityRole="heading">
        Welcome
      </Text>
      <Text>{user?.email ?? 'Account email unavailable'}</Text>
      {selectedWorkspaceId ? (
        <Text color="textSecondary" accessibilityLabel="Active workspace">
          Active workspace ready
        </Text>
      ) : (
        <Text color="textSecondary">No workspace selected</Text>
      )}
      <Button
        testID="mobile-logout-button"
        accessibilityLabel="Sign out"
        onPress={() => {
          void (async () => {
            try {
              await getMobileSession().logout();
            } finally {
              dispatch(logoutCompleted());
            }
          })();
        }}
      >
        Sign out
      </Button>
    </Stack>
  );
};
