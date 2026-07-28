import type { FC } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ListRow, Stack, Text } from '@nexus/shared-ui';

import type { RootStackParamList } from '../../../../navigation/types';
import {
  PRIMARY_NAV_ITEMS,
  SETTINGS_NAV_ITEM,
  type ShellNavItem,
} from '../../constants';

export interface NavigationProps {
  readonly onNavigate?: () => void;
  readonly testID?: string;
}

function isNavItemActive(
  item: ShellNavItem,
  currentRoute: string,
): boolean {
  // ShellNavRouteName keys match MOBILE_ROUTE_NAMES values (param-less routes).
  return item.routeName === currentRoute;
}

function NavItemRow({
  item,
  currentRoute,
  onNavigate,
}: {
  item: ShellNavItem;
  currentRoute: string;
  onNavigate?: () => void;
}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const selected = isNavItemActive(item, currentRoute);

  return (
    <ListRow
      title={item.label}
      selected={selected}
      accessibilityLabel={item.label}
      testID={`mobile-app-shell-nav-${item.id}`}
      onPress={() => {
        onNavigate?.();
        navigation.navigate(item.routeName);
      }}
    />
  );
}

/**
 * Primary shell navigation — existing routes only; no duplicate routing table.
 */
export const Navigation: FC<NavigationProps> = ({
  onNavigate,
  testID = 'mobile-app-shell-navigation',
}) => {
  const route = useRoute();

  return (
    <Stack gap="xs" testID={testID} accessibilityLabel="Primary navigation">
      {PRIMARY_NAV_ITEMS.map((item) => (
        <NavItemRow
          key={item.id}
          item={item}
          currentRoute={route.name}
          onNavigate={onNavigate}
        />
      ))}
    </Stack>
  );
};

export function NavigationSectionLabel({
  children,
}: {
  children: string;
}) {
  return (
    <Text variant="sectionLabel" color="textSecondary" accessibilityRole="text">
      {children}
    </Text>
  );
}

export function SettingsNavigation({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const selected = SETTINGS_NAV_ITEM.routeName === route.name;

  return (
    <Stack gap="xs">
      <NavigationSectionLabel>Settings</NavigationSectionLabel>
      <ListRow
        title={SETTINGS_NAV_ITEM.label}
        selected={selected}
        accessibilityLabel={SETTINGS_NAV_ITEM.label}
        testID={`mobile-app-shell-nav-${SETTINGS_NAV_ITEM.id}-settings`}
        onPress={() => {
          onNavigate?.();
          navigation.navigate(SETTINGS_NAV_ITEM.routeName);
        }}
      />
    </Stack>
  );
}
