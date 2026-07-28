import type { FC, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import {
  Divider,
  EmptyState,
  IconButton,
  ListRow,
  SearchField,
  Stack,
  Surface,
  Text,
  View,
} from "@nexus/shared-ui";

import { APP_SHELL_VERSION, SEARCH_PLACEHOLDER } from "../../../screens/AppShell/constants";
import { Breadcrumbs } from "../../../screens/AppShell/components/Breadcrumbs";
import { ContentArea } from "../../../screens/AppShell/components/ContentArea";
import type { ContentAreaState } from "../../../screens/AppShell/components/ContentArea";
import { Navigation, NavigationSectionLabel } from "../../../screens/AppShell/components/Navigation";

export type AppShellCompositionState =
  | "default"
  | "loading"
  | "collapsed"
  | "empty"
  | "unauthorized"
  | "error";

export interface AppShellCompositionProps {
  readonly state?: AppShellCompositionState;
}

const MOCK_USER = {
  name: "Alex Rivera",
  email: "alex@example.com",
  initials: "AR",
};

const MOCK_WORKSPACE = {
  name: "Alpha Labs",
  initial: "A",
};

function CompositionSidebar({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return null;
  }

  return (
    <aside aria-label="Application sidebar" data-testid="app-shell-sidebar">
      <Surface background="surfaceMuted" borderTone="subtle">
        <Stack gap="md" padding="md">
          <Text variant="h3">Nexus AI Workspace</Text>
          <Divider />
          <NavigationSectionLabel>Workspace</NavigationSectionLabel>
          <ListRow
            leading={<Text weight="bold">{MOCK_WORKSPACE.initial}</Text>}
            title={MOCK_WORKSPACE.name}
            subtitle="Current workspace"
          />
          <SearchField
            value=""
            onChangeText={() => undefined}
            placeholder={SEARCH_PLACEHOLDER}
            accessibilityLabel="Search"
            disabled
          />
          <Navigation />
          <NavigationSectionLabel>Recent</NavigationSectionLabel>
          <EmptyState
            title="No recent items"
            description="Recent navigation will appear here when available."
            testID="app-shell-recent-empty"
          />
          <NavigationSectionLabel>Pinned</NavigationSectionLabel>
          <EmptyState
            title="Nothing pinned"
            description="Pinned items will appear here when available."
            testID="app-shell-pinned-empty"
          />
          <Divider />
          <ListRow
            leading={<Text weight="bold">{MOCK_USER.initials}</Text>}
            title={MOCK_USER.name}
            subtitle={MOCK_USER.email}
          />
          <Text variant="caption" color="textSecondary">
            Version {APP_SHELL_VERSION}
          </Text>
        </Stack>
      </Surface>
    </aside>
  );
}

function CompositionTopBar({
  title,
  onMenuPress,
  showMenu,
}: {
  title: string;
  onMenuPress?: () => void;
  showMenu?: boolean;
}) {
  return (
    <header aria-label="Application top bar" data-testid="app-shell-topbar">
      <Surface background="surfaceMuted" borderTone="subtle">
        <Stack direction="horizontal" align="center" justify="space-between" padding="md">
          <Stack direction="horizontal" gap="md" align="center">
            {showMenu ? (
              <IconButton accessibilityLabel="Open navigation menu" onPress={onMenuPress}>
                <Text weight="bold">☰</Text>
              </IconButton>
            ) : null}
            <Stack gap="xs">
              <Text variant="h3">{title}</Text>
              <Breadcrumbs items={[{ label: title }]} />
            </Stack>
          </Stack>
          <Stack direction="horizontal" gap="md" align="center">
            <Text weight="medium">{MOCK_WORKSPACE.name}</Text>
            <IconButton accessibilityLabel="Notifications (placeholder)" disabled>
              <Text variant="caption">○</Text>
            </IconButton>
            <Text weight="bold">{MOCK_USER.initials}</Text>
          </Stack>
        </Stack>
      </Surface>
    </header>
  );
}

function CompositionBody({
  state,
  collapsed,
}: {
  state: AppShellCompositionState;
  collapsed: boolean;
}) {
  let contentState: ContentAreaState = "default";
  let child: ReactNode = (
    <Text color="textSecondary">Dashboard content placeholder.</Text>
  );

  if (state === "loading") {
    contentState = "loading";
    child = null;
  } else if (state === "empty") {
    contentState = "empty";
    child = null;
  } else if (state === "error") {
    contentState = "error";
    child = null;
  } else if (state === "unauthorized") {
    child = (
      <EmptyState
        title="Sign in required"
        description="Authenticate to access the application shell."
        testID="app-shell-unauthorized"
      />
    );
  }

  return (
    <Stack direction="horizontal" flex={1}>
      <CompositionSidebar collapsed={collapsed} />
      <Stack flex={1}>
        <CompositionTopBar
          title={state === "unauthorized" ? "Unauthorized" : "Dashboard"}
          showMenu={collapsed}
        />
        <main id="main-content" aria-label="Main content" data-testid="application-shell-main">
          <ContentArea state={contentState}>{child}</ContentArea>
        </main>
      </Stack>
    </Stack>
  );
}

/**
 * Storybook-only AppShell composition — mock layout state, no API or Redux.
 */
export const AppShellComposition: FC<AppShellCompositionProps> = ({
  state = "default",
}) => {
  const collapsed = state === "collapsed";

  return (
    <MemoryRouter initialEntries={["/dashboard"]}>
      <View
        testID="application-shell"
        accessibilityLabel="Application"
        style={{ minHeight: "100vh", background: "var(--background, #fff)" }}
      >
        <CompositionBody state={state} collapsed={collapsed} />
      </View>
    </MemoryRouter>
  );
};
