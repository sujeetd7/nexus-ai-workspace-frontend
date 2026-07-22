import { Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { ROUTE_IDS } from "@nexus/shared-types";

import { NotFound } from "../pages/NotFound";
import { RouteErrorFallback } from "../pages/errors";
import { RouteLoading } from "../pages/Loading";
import { ApplicationShell } from "../shell";
import { WEB_ROUTE_PATHS } from "./paths";
import { publicRoutes } from "./routes";

/** Explicit static route table for React Router v7. */
export function createAppRouteObjects(): RouteObject[] {
  const homeRoute = publicRoutes.find((route) => route.id === ROUTE_IDS.HOME);
  const HomeElement = homeRoute?.element;

  return [
    {
      id: "root",
      path: WEB_ROUTE_PATHS.home,
      element: <ApplicationShell />,
      errorElement: <RouteErrorFallback />,
      children: [
        {
          id: ROUTE_IDS.HOME,
          index: true,
          element: HomeElement ? (
            <Suspense fallback={<RouteLoading />}>
              <HomeElement />
            </Suspense>
          ) : (
            <NotFound />
          ),
        },
        {
          id: ROUTE_IDS.NOT_FOUND,
          path: WEB_ROUTE_PATHS.notFound,
          element: <NotFound />,
        },
      ],
    },
  ];
}
