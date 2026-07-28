import type { FC } from 'react';
import { Text, View } from '@nexus/shared-ui';

import { APP_SHELL_VERSION } from '../../constants';

export interface DrawerFooterProps {
  readonly testID?: string;
}

/**
 * Drawer footer — version display only.
 */
export const DrawerFooter: FC<DrawerFooterProps> = ({
  testID = 'mobile-app-shell-drawer-footer',
}) => {
  return (
    <View padding="md" testID={testID}>
      <Text variant="caption" color="textSecondary">
        Version {APP_SHELL_VERSION}
      </Text>
    </View>
  );
};
