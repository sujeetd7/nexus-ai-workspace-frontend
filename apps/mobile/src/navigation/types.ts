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
  Workspaces: undefined;
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
  Workspaces: "Workspaces",
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
  Workspaces: ROUTE_IDS.WORKSPACES,
  NotFound: ROUTE_IDS.NOT_FOUND,
};
