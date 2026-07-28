import type { FC } from 'react';
import {
  Badge,
  IconButton,
  Stack,
  Surface,
  Text,
  View,
} from '@nexus/shared-ui';

import { useShellNavigation } from '../../hooks/useShellNavigation';
import { ProfileSection } from '../ProfileSection';
import { WorkspaceSwitcher } from '../WorkspaceSwitcher';

export interface HeaderProps {
  readonly onMenuPress?: () => void;
  readonly testID?: string;
}

/**
 * Application header — page context, workspace summary, placeholders only.
 */
export const Header: FC<HeaderProps> = ({
  onMenuPress,
  testID = 'mobile-app-shell-header',
}) => {
  const { pageTitle } = useShellNavigation();

  return (
    <View
      testID={testID}
      accessibilityLabel="Application header"
    >
      <Surface background="surfaceMuted" borderTone="subtle">
        <View padding="md">
          <Stack
            direction="horizontal"
            align="center"
            justify="space-between"
            gap="md"
          >
            <Stack direction="horizontal" gap="md" align="center" flex={1}>
              <IconButton
                accessibilityLabel="Open navigation menu"
                onPress={onMenuPress}
                testID={`${testID}-menu`}
              >
                <Text variant="body" weight="bold">
                  ☰
                </Text>
              </IconButton>
              <Stack gap="xs" flex={1}>
                <Text variant="h3" accessibilityRole="heading">
                  {pageTitle}
                </Text>
              </Stack>
            </Stack>

            <Stack direction="horizontal" gap="sm" align="center">
              <View testID={`${testID}-workspace`}>
                <WorkspaceSwitcher compact />
              </View>
              <View testID={`${testID}-notifications`}>
                <IconButton
                  accessibilityLabel="Notifications (placeholder)"
                  disabled
                  testID={`${testID}-notifications-button`}
                >
                  <Badge
                    variant="neutral"
                    size="sm"
                    accessibilityLabel="Notifications"
                  >
                    ○
                  </Badge>
                </IconButton>
              </View>
              <ProfileSection compact testID={`${testID}-profile`} />
            </Stack>
          </Stack>
        </View>
      </Surface>
    </View>
  );
};
