import { lazy } from "react";
import { ROUTE_IDS } from "@nexus/shared-types";

import { WEB_ROUTE_PATHS } from "../paths";
import type { RouteConfig } from "../types/RouteConfig";

/**
 * Explicit public infrastructure routes.
 * No product/feature screens in Batch 3.3.
 */
export const publicRoutes: RouteConfig[] = [
  {
    id: ROUTE_IDS.HOME,
    path: WEB_ROUTE_PATHS.home,
    element: lazy(() =>
      import("../../pages/Home").then((module) => ({
        default: module.HomePage,
      })),
    ),
  },
];
