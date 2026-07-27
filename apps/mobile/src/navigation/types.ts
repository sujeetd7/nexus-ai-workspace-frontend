import type { RouteId } from "@nexus/shared-types";
import { INFRASTRUCTURE_ROUTES, ROUTE_IDS } from "@nexus/shared-types";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Dashboard: undefined;
  NotFound: undefined;
};

export const MOBILE_ROUTE_NAMES = {
  Home: INFRASTRUCTURE_ROUTES[ROUTE_IDS.HOME].mobileName ?? "Home",
  Login: "Login",
  Dashboard: "Dashboard",
  NotFound: INFRASTRUCTURE_ROUTES[ROUTE_IDS.NOT_FOUND].mobileName ?? "NotFound",
} as const satisfies Record<keyof RootStackParamList, string>;

export const MOBILE_ROUTE_IDS: Record<keyof RootStackParamList, RouteId> = {
  Home: ROUTE_IDS.HOME,
  Login: ROUTE_IDS.LOGIN,
  Dashboard: ROUTE_IDS.DASHBOARD,
  NotFound: ROUTE_IDS.NOT_FOUND,
};
