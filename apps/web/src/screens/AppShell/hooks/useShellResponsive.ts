import { breakpoints } from "@nexus/shared-ui";
import { useCallback, useEffect, useState } from "react";

export type ShellLayoutMode = "desktop" | "tablet" | "mobile";

export interface ShellResponsiveState {
  readonly mode: ShellLayoutMode;
  readonly sidebarCollapsed: boolean;
  readonly drawerOpen: boolean;
  readonly sidebarVisible: boolean;
  readonly sidebarOverlay: boolean;
  readonly isDesktop: boolean;
  readonly isTablet: boolean;
  readonly isMobile: boolean;
  toggleSidebar: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

function resolveMode(): ShellLayoutMode {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "desktop";
  }
  if (window.matchMedia(`(min-width: ${breakpoints.lg}px)`).matches) {
    return "desktop";
  }
  if (window.matchMedia(`(min-width: ${breakpoints.md}px)`).matches) {
    return "tablet";
  }
  return "mobile";
}

/**
 * Responsive shell layout using shared-ui breakpoint scale only.
 */
export function useShellResponsive(): ShellResponsiveState {
  const [mode, setMode] = useState<ShellLayoutMode>(resolveMode);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mdQuery = window.matchMedia(`(min-width: ${breakpoints.md}px)`);
    const lgQuery = window.matchMedia(`(min-width: ${breakpoints.lg}px)`);

    const update = () => {
      const next = resolveMode();
      setMode(next);
      if (next === "desktop") {
        setDrawerOpen(false);
      }
      if (next === "mobile") {
        setSidebarCollapsed(false);
      }
    };

    update();
    mdQuery.addEventListener("change", update);
    lgQuery.addEventListener("change", update);
    return () => {
      mdQuery.removeEventListener("change", update);
      lgQuery.removeEventListener("change", update);
    };
  }, []);

  const toggleSidebar = useCallback(() => {
    if (mode === "desktop") {
      setSidebarCollapsed((value) => !value);
      return;
    }
    if (mode === "tablet") {
      setSidebarCollapsed((value) => !value);
      return;
    }
    setDrawerOpen((value) => !value);
  }, [mode]);

  const openDrawer = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const sidebarVisible =
    mode === "desktop"
      ? !sidebarCollapsed
      : mode === "tablet"
        ? !sidebarCollapsed
        : drawerOpen;

  const sidebarOverlay = mode === "mobile" && drawerOpen;

  return {
    mode,
    sidebarCollapsed,
    drawerOpen,
    sidebarVisible,
    sidebarOverlay,
    isDesktop: mode === "desktop",
    isTablet: mode === "tablet",
    isMobile: mode === "mobile",
    toggleSidebar,
    openDrawer,
    closeDrawer,
  };
}
