import { useState, type FC } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Divider,
  EmptyState,
  ListRow,
  SearchField,
  Stack,
  Surface,
  Text,
  View,
} from "@nexus/shared-ui";

import { APP_SHELL_VERSION, SEARCH_PLACEHOLDER, SETTINGS_NAV_ITEM } from "../../constants";
import { Navigation, NavigationSectionLabel } from "../Navigation";
import { ProfileMenuFooter } from "../ProfileMenu";
import { WorkspaceSwitcher } from "../WorkspaceSwitcher";
import { sidebarInnerStyle, sidebarScrollStyle, sidebarSectionStyle } from "./Sidebar.styles";

export interface SidebarProps {
  readonly visible?: boolean;
  readonly overlay?: boolean;
  readonly onNavigate?: () => void;
  readonly testID?: string;
}

function SidebarLogo() {
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

function SidebarSearch() {
  const [query, setQuery] = useState("");

  return (
    <View style={sidebarSectionStyle} testID="app-shell-search">
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

function SidebarRecents() {
  return (
    <Stack gap="xs" style={sidebarSectionStyle}>
      <NavigationSectionLabel>Recent</NavigationSectionLabel>
      <EmptyState
        title="No recent items"
        description="Recent navigation will appear here when available."
        testID="app-shell-recent-empty"
      />
    </Stack>
  );
}

function SidebarPinned() {
  return (
    <Stack gap="xs" style={sidebarSectionStyle}>
      <NavigationSectionLabel>Pinned</NavigationSectionLabel>
      <EmptyState
        title="Nothing pinned"
        description="Pinned items will appear here when available."
        testID="app-shell-pinned-empty"
      />
    </Stack>
  );
}

function SidebarSettings({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const selected = pathname.startsWith(SETTINGS_NAV_ITEM.path);

  return (
    <Stack gap="xs" style={sidebarSectionStyle}>
      <NavigationSectionLabel>Settings</NavigationSectionLabel>
      <Link
        to={SETTINGS_NAV_ITEM.path}
        onClick={onNavigate}
        style={{ textDecoration: "none", color: "inherit", display: "block" }}
        aria-current={selected ? "page" : undefined}
      >
        <ListRow
          title={SETTINGS_NAV_ITEM.label}
          selected={selected}
          accessibilityLabel={SETTINGS_NAV_ITEM.label}
          testID={`app-shell-nav-${SETTINGS_NAV_ITEM.id}`}
        />
      </Link>
    </Stack>
  );
}

function SidebarVersion() {
  return (
    <View padding="md" testID="app-shell-version">
      <Text variant="caption" color="textSecondary">
        Version {APP_SHELL_VERSION}
      </Text>
    </View>
  );
}

/**
 * Application sidebar — composes shared-ui only; no feature business logic.
 */
export const Sidebar: FC<SidebarProps> = ({
  visible = true,
  overlay = false,
  onNavigate,
  testID = "app-shell-sidebar",
}) => {
  if (!visible) {
    return null;
  }

  return (
    <aside
      aria-label="Application sidebar"
      data-testid={testID}
      data-overlay={overlay ? "true" : undefined}
      style={{
        width: overlay ? 260 : undefined,
        flexShrink: 0,
        height: overlay ? "100%" : undefined,
        ...sidebarInnerStyle,
      }}
    >
      <Surface background="surfaceMuted" borderTone="subtle">
        <SidebarLogo />
        <Divider />
        <View style={sidebarSectionStyle} padding="sm">
          <NavigationSectionLabel>Workspace</NavigationSectionLabel>
          <WorkspaceSwitcher />
        </View>
        <Divider />
        <SidebarSearch />
        <Divider />
        <View style={sidebarScrollStyle}>
          <Stack gap="md" padding="sm">
            <Navigation onNavigate={onNavigate} />
            <Divider />
            <SidebarRecents />
            <Divider />
            <SidebarPinned />
            <Divider />
            <SidebarSettings onNavigate={onNavigate} />
          </Stack>
        </View>
        <Divider />
        <View style={sidebarSectionStyle} padding="md">
          <ProfileMenuFooter />
        </View>
        <SidebarVersion />
      </Surface>
    </aside>
  );
};
