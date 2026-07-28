import { Suspense, type FC, type ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Stack, View } from "@nexus/shared-ui";
import { useSelector } from "react-redux";

import { RouteLoading } from "../../pages/Loading";
import { selectIsAuthenticated } from "../../store/slices/auth/selectors";
import {
  drawerBackdropStyle,
  mainColumnStyle,
  mainContentStyle,
  shellBodyStyle,
  shellRootStyle,
  sidebarStyle,
  skipLinkStyle,
} from "./AppShell.styles";
import { ContentArea } from "./components/ContentArea";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { GUEST_SHELL_PATHS } from "./constants";
import { useShellResponsive } from "./hooks/useShellResponsive";

export interface AppShellProps {
  readonly children?: ReactNode;
  readonly forceChrome?: boolean;
  readonly contentState?: "default" | "loading" | "empty" | "error";
}

function shouldShowAuthenticatedChrome(
  pathname: string,
  isAuthenticated: boolean,
  forceChrome?: boolean,
): boolean {
  if (forceChrome) {
    return true;
  }
  if (!isAuthenticated) {
    return false;
  }
  return !GUEST_SHELL_PATHS.has(pathname);
}

/**
 * Production Nexus web application shell — sidebar, top bar, and content region.
 */
export const AppShell: FC<AppShellProps> = ({
  children,
  forceChrome,
  contentState = "default",
}) => {
  const { pathname } = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const responsive = useShellResponsive();
  const showChrome = shouldShowAuthenticatedChrome(
    pathname,
    isAuthenticated,
    forceChrome,
  );

  const closeDrawer = responsive.closeDrawer;
  const handleNavigate = responsive.isMobile ? closeDrawer : undefined;

  return (
    <View
      flex={1}
      background="background"
      testID="application-shell"
      accessibilityLabel="Application"
      style={shellRootStyle}
    >
      <style>
        {`.nexus-skip-to-content:focus{transform:translateY(0);outline:2px solid currentColor;outline-offset:2px;}`}
      </style>
      <a href="#main-content" className="nexus-skip-to-content" style={skipLinkStyle}>
        Skip to content
      </a>

      {showChrome ? (
        <Stack direction="vertical" flex={1}>
          <div style={shellBodyStyle}>
            {responsive.sidebarOverlay ? (
              <button
                type="button"
                aria-label="Close navigation menu"
                data-testid="app-shell-drawer-backdrop"
                style={drawerBackdropStyle}
                onClick={closeDrawer}
              />
            ) : null}

            <div
              style={sidebarStyle(
                responsive.sidebarVisible,
                responsive.sidebarOverlay,
              )}
            >
              <Sidebar
                visible={responsive.sidebarVisible}
                overlay={responsive.sidebarOverlay}
                onNavigate={handleNavigate}
              />
            </div>

            <div style={mainColumnStyle}>
              <TopBar
                showMenuButton={!responsive.isDesktop}
                onMenuPress={responsive.toggleSidebar}
              />
              <main
                id="main-content"
                tabIndex={-1}
                aria-label="Main content"
                data-testid="application-shell-main"
                style={mainContentStyle}
              >
                <ContentArea state={contentState}>
                  <Suspense fallback={<RouteLoading />}>
                    {children ?? <Outlet />}
                  </Suspense>
                </ContentArea>
              </main>
            </div>
          </div>
        </Stack>
      ) : (
        <main
          id="main-content"
          tabIndex={-1}
          aria-label="Main content"
          data-testid="application-shell-main"
          style={{ flex: 1, outline: "none" }}
        >
          <View flex={1} padding="md">
            <Suspense fallback={<RouteLoading />}>
              {children ?? <Outlet />}
            </Suspense>
          </View>
        </main>
      )}
    </View>
  );
};
