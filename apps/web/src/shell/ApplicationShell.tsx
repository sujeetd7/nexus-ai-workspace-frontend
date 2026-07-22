import { Suspense, type CSSProperties } from "react";
import { Outlet } from "react-router-dom";
import { Divider, Stack, Text, View } from "@nexus/shared-ui";

import { RouteLoading } from "../pages/Loading";

const skipLinkStyle: CSSProperties = {
  position: "absolute",
  left: 16,
  top: 16,
  zIndex: 1000,
  padding: "8px 12px",
  backgroundColor: "var(--background, #ffffff)",
  color: "inherit",
  textDecoration: "none",
  borderRadius: 4,
  transform: "translateY(-220%)",
};

/**
 * Application-owned web shell — structural framing only.
 * Shared UI provides primitives; chrome stays in apps/web.
 */
export function ApplicationShell() {
  return (
    <View
      flex={1}
      background="background"
      testID="application-shell"
      accessibilityLabel="Application"
      style={{ minHeight: "100vh", position: "relative" }}
    >
      <style>
        {`.nexus-skip-to-content:focus{transform:translateY(0);outline:2px solid currentColor;outline-offset:2px;}`}
      </style>
      <a href="#main-content" className="nexus-skip-to-content" style={skipLinkStyle}>
        Skip to content
      </a>

      <Stack direction="vertical" flex={1} gap="sm">
        <header aria-label="Application header" data-testid="application-shell-header">
          <Stack
            direction="horizontal"
            align="center"
            justify="space-between"
            padding="md"
          >
            <Text variant="h3" accessibilityRole="heading">
              Nexus
            </Text>
            <nav aria-label="Primary">
              <Text variant="caption" color="textSecondary">
                Navigation
              </Text>
            </nav>
          </Stack>
        </header>

        <Divider />

        <main
          id="main-content"
          tabIndex={-1}
          aria-label="Main content"
          data-testid="application-shell-main"
          style={{ flex: 1, outline: "none" }}
        >
          <View flex={1} padding="md">
            <Suspense fallback={<RouteLoading />}>
              <Outlet />
            </Suspense>
          </View>
        </main>
      </Stack>
    </View>
  );
}
