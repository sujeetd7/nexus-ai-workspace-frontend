import { useMemo } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { ROUTE_IDS } from "@nexus/shared-types";

import { WEB_ROUTE_PATHS } from "../../../router/paths";

export interface ShellBreadcrumb {
  readonly label: string;
  readonly path?: string;
}

export interface ShellNavigationContext {
  readonly pageTitle: string;
  readonly breadcrumbs: readonly ShellBreadcrumb[];
}

interface RouteMeta {
  readonly title: string;
  readonly breadcrumbs: readonly ShellBreadcrumb[];
}

const ROUTE_META: Record<string, RouteMeta> = {
  [ROUTE_IDS.HOME]: {
    title: "Home",
    breadcrumbs: [{ label: "Home" }],
  },
  [ROUTE_IDS.DASHBOARD]: {
    title: "Dashboard",
    breadcrumbs: [{ label: "Dashboard" }],
  },
  [ROUTE_IDS.WORKSPACES]: {
    title: "Workspaces",
    breadcrumbs: [{ label: "Workspaces" }],
  },
  [ROUTE_IDS.WORKSPACE_CREATE]: {
    title: "Create workspace",
    breadcrumbs: [
      { label: "Workspaces", path: WEB_ROUTE_PATHS.workspaces },
      { label: "Create workspace" },
    ],
  },
  [ROUTE_IDS.WORKSPACE_DETAIL]: {
    title: "Workspace",
    breadcrumbs: [
      { label: "Workspaces", path: WEB_ROUTE_PATHS.workspaces },
      { label: "Workspace" },
    ],
  },
  [ROUTE_IDS.WORKSPACE_MEMBERS]: {
    title: "Members",
    breadcrumbs: [
      { label: "Workspaces", path: WEB_ROUTE_PATHS.workspaces },
      { label: "Members" },
    ],
  },
  [ROUTE_IDS.WORKSPACE_INVITATIONS]: {
    title: "Invitations",
    breadcrumbs: [
      { label: "Workspaces", path: WEB_ROUTE_PATHS.workspaces },
      { label: "Invitations" },
    ],
  },
  [ROUTE_IDS.PROFILE]: {
    title: "Profile",
    breadcrumbs: [{ label: "Profile" }],
  },
  [ROUTE_IDS.PROFILE_EDIT]: {
    title: "Edit profile",
    breadcrumbs: [
      { label: "Profile", path: WEB_ROUTE_PATHS.profile },
      { label: "Edit profile" },
    ],
  },
  [ROUTE_IDS.PROFILE_PREFERENCES]: {
    title: "Settings",
    breadcrumbs: [
      { label: "Profile", path: WEB_ROUTE_PATHS.profile },
      { label: "Settings" },
    ],
  },
};

const PATH_PATTERNS: Array<{ id: string; pattern: string }> = [
  { id: ROUTE_IDS.HOME, pattern: WEB_ROUTE_PATHS.home },
  { id: ROUTE_IDS.DASHBOARD, pattern: WEB_ROUTE_PATHS.dashboard },
  { id: ROUTE_IDS.WORKSPACES, pattern: WEB_ROUTE_PATHS.workspaces },
  { id: ROUTE_IDS.WORKSPACE_CREATE, pattern: WEB_ROUTE_PATHS.workspaceCreate },
  { id: ROUTE_IDS.WORKSPACE_DETAIL, pattern: WEB_ROUTE_PATHS.workspaceDetail },
  {
    id: ROUTE_IDS.WORKSPACE_MEMBERS,
    pattern: WEB_ROUTE_PATHS.workspaceMembers,
  },
  {
    id: ROUTE_IDS.WORKSPACE_INVITATIONS,
    pattern: WEB_ROUTE_PATHS.workspaceInvitations,
  },
  { id: ROUTE_IDS.WORKSPACE_INVITE, pattern: WEB_ROUTE_PATHS.workspaceInvite },
  {
    id: ROUTE_IDS.WORKSPACE_ACCEPT_INVITATION,
    pattern: WEB_ROUTE_PATHS.acceptInvitation,
  },
  { id: ROUTE_IDS.PROFILE, pattern: WEB_ROUTE_PATHS.profile },
  { id: ROUTE_IDS.PROFILE_EDIT, pattern: WEB_ROUTE_PATHS.profileEdit },
  {
    id: ROUTE_IDS.PROFILE_PREFERENCES,
    pattern: WEB_ROUTE_PATHS.profilePreferences,
  },
];

function resolveRouteId(pathname: string): string | undefined {
  for (const entry of PATH_PATTERNS) {
    if (matchPath({ path: entry.pattern, end: true }, pathname)) {
      return entry.id;
    }
  }
  return undefined;
}

export function useShellNavigation(): ShellNavigationContext {
  const { pathname } = useLocation();

  return useMemo(() => {
    const routeId = resolveRouteId(pathname);
    const meta = routeId ? ROUTE_META[routeId] : undefined;

    if (meta) {
      return {
        pageTitle: meta.title,
        breadcrumbs: meta.breadcrumbs,
      };
    }

    return {
      pageTitle: "Nexus",
      breadcrumbs: [{ label: "Nexus" }],
    };
  }, [pathname]);
}
