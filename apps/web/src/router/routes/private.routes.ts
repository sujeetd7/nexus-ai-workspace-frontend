import { lazy } from "react";
import { ROUTE_IDS } from "@nexus/shared-types";

import { WEB_ROUTE_PATHS } from "../paths";
import type { RouteConfig } from "../types/RouteConfig";

export const privateRoutes: RouteConfig[] = [
  {
    id: ROUTE_IDS.DASHBOARD,
    path: WEB_ROUTE_PATHS.dashboard,
    element: lazy(() =>
      import("../../features/auth/screens/DashboardScreen").then((module) => ({
        default: module.DashboardScreen,
      })),
    ),
    auth: true,
  },
];
