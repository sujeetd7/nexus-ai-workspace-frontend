import { ROUTE_IDS } from "@nexus/shared-types";

import { WEB_ROUTE_PATHS } from "../../router/paths";

/** Display-only shell version — mirrors web package version. */
export const APP_SHELL_VERSION = "0.0.0";

export type ShellNavSection = "primary" | "settings";

export interface ShellNavItem {
  readonly id: string;
  readonly label: string;
  readonly path: string;
  readonly section: ShellNavSection;
}

/** Primary navigation — existing authenticated routes only. */
export const PRIMARY_NAV_ITEMS: readonly ShellNavItem[] = [
  {
    id: ROUTE_IDS.DASHBOARD,
    label: "Dashboard",
    path: WEB_ROUTE_PATHS.dashboard,
    section: "primary",
  },
  {
    id: ROUTE_IDS.WORKSPACES,
    label: "Workspaces",
    path: WEB_ROUTE_PATHS.workspaces,
    section: "primary",
  },
  {
    id: ROUTE_IDS.PROFILE,
    label: "Profile",
    path: WEB_ROUTE_PATHS.profile,
    section: "primary",
  },
] as const;

export const SETTINGS_NAV_ITEM: ShellNavItem = {
  id: ROUTE_IDS.PROFILE_PREFERENCES,
  label: "Settings",
  path: WEB_ROUTE_PATHS.profilePreferences,
  section: "settings",
};

/** Guest and public routes render content without authenticated chrome. */
export const GUEST_SHELL_PATHS = new Set<string>([
  WEB_ROUTE_PATHS.home,
  WEB_ROUTE_PATHS.login,
  WEB_ROUTE_PATHS.register,
  WEB_ROUTE_PATHS.forgotPassword,
  WEB_ROUTE_PATHS.resetPassword,
  WEB_ROUTE_PATHS.verifyEmail,
]);

export const SEARCH_PLACEHOLDER =
  "Search (placeholder — backend not connected)";
