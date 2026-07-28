import type { FC } from "react";
import {
  Badge,
  IconButton,
  Stack,
  Surface,
  Text,
  View,
} from "@nexus/shared-ui";

import { useShellNavigation } from "../../hooks/useShellNavigation";
import { Breadcrumbs } from "../Breadcrumbs";
import { ProfileMenu } from "../ProfileMenu";
import { WorkspaceSwitcher } from "../WorkspaceSwitcher";
import { topBarInnerStyle } from "./TopBar.styles";

export interface TopBarProps {
  readonly onMenuPress?: () => void;
  readonly showMenuButton?: boolean;
  readonly testID?: string;
}

/**
 * Application top bar — page context, workspace summary, placeholders only.
 */
export const TopBar: FC<TopBarProps> = ({
  onMenuPress,
  showMenuButton = false,
  testID = "app-shell-topbar",
}) => {
  const { pageTitle, breadcrumbs } = useShellNavigation();

  return (
    <header aria-label="Application top bar" data-testid={testID}>
      <Surface background="surfaceMuted" borderTone="subtle">
        <View padding="md" style={topBarInnerStyle}>
          <Stack
            direction="horizontal"
            align="center"
            justify="space-between"
            gap="md"
          >
            <Stack direction="horizontal" gap="md" align="center" flex={1}>
              {showMenuButton ? (
                <IconButton
                  accessibilityLabel="Open navigation menu"
                  onPress={onMenuPress}
                  testID={`${testID}-menu`}
                >
                  <Text variant="body" weight="bold">
                    ☰
                  </Text>
                </IconButton>
              ) : null}
              <Stack gap="xs" flex={1}>
                <Text variant="h3" accessibilityRole="heading">
                  {pageTitle}
                </Text>
                <Breadcrumbs items={breadcrumbs} />
              </Stack>
            </Stack>

            <Stack direction="horizontal" gap="md" align="center">
              <View testID={`${testID}-workspace`}>
                <WorkspaceSwitcher compact />
              </View>
              <View testID={`${testID}-notifications`}>
                <IconButton
                  accessibilityLabel="Notifications (placeholder)"
                  disabled
                  testID={`${testID}-notifications-button`}
                >
                  <Badge variant="neutral" size="sm" accessibilityLabel="Notifications">
                    ○
                  </Badge>
                </IconButton>
              </View>
              <ProfileMenu compact />
            </Stack>
          </Stack>
        </View>
      </Surface>
    </header>
  );
};
