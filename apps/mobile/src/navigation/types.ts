import type { RouteId } from "@nexus/shared-types";
import { INFRASTRUCTURE_ROUTES, ROUTE_IDS } from "@nexus/shared-types";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string } | undefined;
  VerifyEmail: { token?: string } | undefined;
  Dashboard: undefined;
  Profile: undefined;
  ProfileEdit: undefined;
  ProfilePreferences: undefined;
  Workspaces: undefined;
  WorkspaceDetail: { workspaceId: string };
  WorkspaceMembers: { workspaceId: string };
  WorkspaceInvitations: { workspaceId: string };
  WorkspaceInvite: { workspaceId: string };
  AcceptInvitation: { token?: string } | undefined;
  NotFound: undefined;
};

export const MOBILE_ROUTE_NAMES = {
  Home: INFRASTRUCTURE_ROUTES[ROUTE_IDS.HOME].mobileName ?? "Home",
  Login: "Login",
  Register: "Register",
  ForgotPassword: "ForgotPassword",
  ResetPassword: "ResetPassword",
  VerifyEmail: "VerifyEmail",
  Dashboard: "Dashboard",
  Profile: "Profile",
  ProfileEdit: "ProfileEdit",
  ProfilePreferences: "ProfilePreferences",
  Workspaces: "Workspaces",
  WorkspaceDetail: "WorkspaceDetail",
  WorkspaceMembers: "WorkspaceMembers",
  WorkspaceInvitations: "WorkspaceInvitations",
  WorkspaceInvite: "WorkspaceInvite",
  AcceptInvitation: "AcceptInvitation",
  NotFound: INFRASTRUCTURE_ROUTES[ROUTE_IDS.NOT_FOUND].mobileName ?? "NotFound",
} as const satisfies Record<keyof RootStackParamList, string>;

export const MOBILE_ROUTE_IDS: Record<keyof RootStackParamList, RouteId> = {
  Home: ROUTE_IDS.HOME,
  Login: ROUTE_IDS.LOGIN,
  Register: ROUTE_IDS.REGISTER,
  ForgotPassword: ROUTE_IDS.FORGOT_PASSWORD,
  ResetPassword: ROUTE_IDS.RESET_PASSWORD,
  VerifyEmail: ROUTE_IDS.VERIFY_EMAIL,
  Dashboard: ROUTE_IDS.DASHBOARD,
  Profile: ROUTE_IDS.PROFILE,
  ProfileEdit: ROUTE_IDS.PROFILE_EDIT,
  ProfilePreferences: ROUTE_IDS.PROFILE_PREFERENCES,
  Workspaces: ROUTE_IDS.WORKSPACES,
  WorkspaceDetail: ROUTE_IDS.WORKSPACE_DETAIL,
  WorkspaceMembers: ROUTE_IDS.WORKSPACE_MEMBERS,
  WorkspaceInvitations: ROUTE_IDS.WORKSPACE_INVITATIONS,
  WorkspaceInvite: ROUTE_IDS.WORKSPACE_INVITE,
  AcceptInvitation: ROUTE_IDS.WORKSPACE_ACCEPT_INVITATION,
  NotFound: ROUTE_IDS.NOT_FOUND,
};
