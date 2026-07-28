import type { LinkingOptions } from "@react-navigation/native";

import type { RootStackParamList } from "./types";
import { MOBILE_ROUTE_NAMES } from "./types";

/**
 * Deep-link readiness config.
 * Prefixes stay empty until an approved scheme/domain exists — do not invent production URLs.
 */
export const navigationLinking: LinkingOptions<RootStackParamList> = {
  prefixes: [],
  config: {
    screens: {
      [MOBILE_ROUTE_NAMES.Login]: "login",
      [MOBILE_ROUTE_NAMES.Register]: "register",
      [MOBILE_ROUTE_NAMES.ForgotPassword]: "forgot-password",
      [MOBILE_ROUTE_NAMES.ResetPassword]: {
        path: "reset-password",
        parse: {
          token: (value: string) => value,
        },
      },
      [MOBILE_ROUTE_NAMES.VerifyEmail]: {
        path: "verify-email",
        parse: {
          token: (value: string) => value,
        },
      },
      [MOBILE_ROUTE_NAMES.Dashboard]: "dashboard",
      [MOBILE_ROUTE_NAMES.Workspaces]: "workspaces",
      [MOBILE_ROUTE_NAMES.WorkspaceDetail]: "workspaces/:workspaceId",
      [MOBILE_ROUTE_NAMES.WorkspaceMembers]: "workspaces/:workspaceId/members",
      [MOBILE_ROUTE_NAMES.WorkspaceInvitations]:
        "workspaces/:workspaceId/invitations",
      [MOBILE_ROUTE_NAMES.WorkspaceInvite]: "workspaces/:workspaceId/invite",
      [MOBILE_ROUTE_NAMES.AcceptInvitation]: {
        path: "invitations/accept",
        parse: {
          token: (value: string) => value,
        },
      },
      [MOBILE_ROUTE_NAMES.Profile]: "profile",
      [MOBILE_ROUTE_NAMES.ProfileEdit]: "profile/edit",
      [MOBILE_ROUTE_NAMES.ProfilePreferences]: "profile/preferences",
      [MOBILE_ROUTE_NAMES.Home]: "",
      [MOBILE_ROUTE_NAMES.NotFound]: "*",
    },
  },
};
