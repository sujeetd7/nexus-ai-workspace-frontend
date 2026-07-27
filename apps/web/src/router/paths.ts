import { ROUTE_IDS } from "@nexus/shared-types";

/** Web path constants for infrastructure and auth routes. */
export const WEB_ROUTE_PATHS = {
  home: "/",
  notFound: "*",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  dashboard: "/dashboard",
  profile: "/profile",
  profileEdit: "/profile/edit",
  profilePreferences: "/profile/preferences",
  workspaces: "/workspaces",
  workspaceCreate: "/workspaces/new",
  workspaceDetail: "/workspaces/:workspaceId",
  workspaceMembers: "/workspaces/:workspaceId/members",
  workspaceInvitations: "/workspaces/:workspaceId/invitations",
  workspaceInvite: "/workspaces/:workspaceId/invite",
  acceptInvitation: "/invitations/accept",
} as const;

export const AUTH_ROUTE_IDS = {
  LOGIN: ROUTE_IDS.LOGIN,
  REGISTER: ROUTE_IDS.REGISTER,
  FORGOT_PASSWORD: ROUTE_IDS.FORGOT_PASSWORD,
  RESET_PASSWORD: ROUTE_IDS.RESET_PASSWORD,
  VERIFY_EMAIL: ROUTE_IDS.VERIFY_EMAIL,
  DASHBOARD: ROUTE_IDS.DASHBOARD,
} as const;
