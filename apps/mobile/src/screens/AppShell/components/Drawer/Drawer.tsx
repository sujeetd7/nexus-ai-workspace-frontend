import { useState, type FC } from 'react';
import { Pressable, ScrollView } from 'react-native';
import {
  Divider,
  EmptyState,
  SearchField,
  Stack,
  Surface,
  Text,
  View,
} from '@nexus/shared-ui';

import { SEARCH_PLACEHOLDER } from '../../constants';
import { styles } from '../../MobileAppShell.styles';
import { DrawerFooter } from '../DrawerFooter';
import {
  Navigation,
  NavigationSectionLabel,
  SettingsNavigation,
} from '../Navigation';
import { ProfileSection } from '../ProfileSection';
import { WorkspaceSwitcher } from '../WorkspaceSwitcher';

export interface DrawerProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onNavigate?: () => void;
  readonly testID?: string;
}

function DrawerLogo() {
  return (
    <Stack gap="xs" padding="md">
      <Text variant="h3" accessibilityRole="heading">
        Nexus AI Workspace
      </Text>
      <Text variant="caption" color="textSecondary">
        Application shell
      </Text>
    </Stack>
  );
}

function DrawerSearch() {
  const [query, setQuery] = useState('');

  return (
    <View padding="sm" testID="mobile-app-shell-search">
      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder={SEARCH_PLACEHOLDER}
        accessibilityLabel="Search"
        accessibilityHint="Visual placeholder only. Search is not connected."
        disabled
      />
    </View>
  );
}

function DrawerRecents() {
  return (
    <Stack gap="xs" padding="sm">
      <NavigationSectionLabel>Recent</NavigationSectionLabel>
      <EmptyState
        title="No recent items"
        description="Recent navigation will appear here when available."
        testID="mobile-app-shell-recent-empty"
      />
    </Stack>
  );
}

function DrawerPinned() {
  return (
    <Stack gap="xs" padding="sm">
      <NavigationSectionLabel>Pinned</NavigationSectionLabel>
      <EmptyState
        title="Nothing pinned"
        description="Pinned items will appear here when available."
        testID="mobile-app-shell-pinned-empty"
      />
    </Stack>
  );
}

/**
 * Mobile navigation drawer — composes shared-ui only; no feature business logic.
 */
export const Drawer: FC<DrawerProps> = ({
  open,
  onClose,
  onNavigate,
  testID = 'mobile-app-shell-drawer',
}) => {
  if (!open) {
    return null;
  }

  const handleNavigate = () => {
    onNavigate?.();
    onClose();
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close navigation menu"
        testID="mobile-app-shell-drawer-backdrop"
        style={styles.backdrop}
        onPress={onClose}
      />
      <View
        style={styles.drawer}
        testID={testID}
        accessibilityLabel="Application navigation drawer"
      >
        <Surface background="surfaceMuted" borderTone="subtle">
          <DrawerLogo />
          <Divider />
          <View padding="sm">
            <NavigationSectionLabel>Workspace</NavigationSectionLabel>
            <WorkspaceSwitcher onNavigate={handleNavigate} />
          </View>
          <Divider />
          <DrawerSearch />
          <Divider />
          <ScrollView
            style={styles.drawerScroll}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <Stack gap="md" padding="sm">
              <Navigation onNavigate={handleNavigate} />
              <Divider />
              <DrawerRecents />
              <Divider />
              <DrawerPinned />
              <Divider />
              <SettingsNavigation onNavigate={handleNavigate} />
            </Stack>
          </ScrollView>
          <Divider />
          <View padding="md">
            <ProfileSection onNavigate={handleNavigate} />
          </View>
          <DrawerFooter />
        </Surface>
      </View>
    </>
  );
};
