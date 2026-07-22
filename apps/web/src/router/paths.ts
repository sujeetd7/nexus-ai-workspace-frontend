import { INFRASTRUCTURE_ROUTES, ROUTE_IDS } from "@nexus/shared-types";

/** Web path constants derived from shared infrastructure catalog. */
export const WEB_ROUTE_PATHS = {
  home: INFRASTRUCTURE_ROUTES[ROUTE_IDS.HOME].webPath ?? "/",
  notFound: INFRASTRUCTURE_ROUTES[ROUTE_IDS.NOT_FOUND].webPath ?? "*",
} as const;
