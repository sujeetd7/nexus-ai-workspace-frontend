import type { RouteId } from "@nexus/shared-types";
import { INFRASTRUCTURE_ROUTES, ROUTE_IDS } from "@nexus/shared-types";

/**
 * Typed React Navigation param list for infrastructure routes only.
 * No feature params in Batch 3.3.
 */
export type RootStackParamList = {
  Home: undefined;
  NotFound: undefined;
};

export const MOBILE_ROUTE_NAMES = {
  Home: INFRASTRUCTURE_ROUTES[ROUTE_IDS.HOME].mobileName ?? "Home",
  NotFound: INFRASTRUCTURE_ROUTES[ROUTE_IDS.NOT_FOUND].mobileName ?? "NotFound",
} as const satisfies Record<keyof RootStackParamList, string>;

export const MOBILE_ROUTE_IDS: Record<keyof RootStackParamList, RouteId> = {
  Home: ROUTE_IDS.HOME,
  NotFound: ROUTE_IDS.NOT_FOUND,
};
