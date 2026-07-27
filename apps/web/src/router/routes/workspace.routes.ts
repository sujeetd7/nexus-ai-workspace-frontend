import { lazy } from "react";
import { ROUTE_IDS } from "@nexus/shared-types";

import { WEB_ROUTE_PATHS } from "../paths";
import type { RouteConfig } from "../types/RouteConfig";

export const workspaceRoutes: RouteConfig[] = [
  {
    id: ROUTE_IDS.WORKSPACES,
    path: WEB_ROUTE_PATHS.workspaces,
    element: lazy(() =>
      import("../../features/workspaces/screens/WorkspaceListScreen").then(
        (module) => ({
          default: module.WorkspaceListScreen,
        }),
      ),
    ),
    auth: true,
  },
  {
    id: ROUTE_IDS.WORKSPACE_CREATE,
    path: WEB_ROUTE_PATHS.workspaceCreate,
    element: lazy(() =>
      import("../../features/workspaces/screens/CreateWorkspaceScreen").then(
        (module) => ({
          default: module.CreateWorkspaceScreen,
        }),
      ),
    ),
    auth: true,
  },
  {
    id: ROUTE_IDS.WORKSPACE_DETAIL,
    path: WEB_ROUTE_PATHS.workspaceDetail,
    element: lazy(() =>
      import("../../features/workspaces/screens/WorkspaceDetailScreen").then(
        (module) => ({
          default: module.WorkspaceDetailScreen,
        }),
      ),
    ),
    auth: true,
  },
  {
    id: ROUTE_IDS.WORKSPACE_MEMBERS,
    path: WEB_ROUTE_PATHS.workspaceMembers,
    element: lazy(() =>
      import("../../features/workspaces/screens/WorkspaceMembersScreen").then(
        (module) => ({
          default: module.WorkspaceMembersScreen,
        }),
      ),
    ),
    auth: true,
  },
  {
    id: ROUTE_IDS.WORKSPACE_INVITATIONS,
    path: WEB_ROUTE_PATHS.workspaceInvitations,
    element: lazy(() =>
      import("../../features/workspaces/screens/WorkspaceInvitationsScreen").then(
        (module) => ({
          default: module.WorkspaceInvitationsScreen,
        }),
      ),
    ),
    auth: true,
  },
  {
    id: ROUTE_IDS.WORKSPACE_INVITE,
    path: WEB_ROUTE_PATHS.workspaceInvite,
    element: lazy(() =>
      import("../../features/workspaces/screens/WorkspaceInvitationsScreen").then(
        (module) => ({
          default: module.InviteMemberScreen,
        }),
      ),
    ),
    auth: true,
  },
  {
    id: ROUTE_IDS.WORKSPACE_ACCEPT_INVITATION,
    path: WEB_ROUTE_PATHS.acceptInvitation,
    element: lazy(() =>
      import("../../features/workspaces/screens/AcceptInvitationScreen").then(
        (module) => ({
          default: module.AcceptInvitationScreen,
        }),
      ),
    ),
    auth: true,
  },
];
