import { useMemo, type ReactElement } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { createAppRouteObjects } from "./createAppRouteObjects";

/**
 * Application-owned web router (React Router v7 data API).
 * createBrowserRouter + RouterProvider remains in apps/web — not shared.
 */
export function AppRouter(): ReactElement {
  const router = useMemo(
    () => createBrowserRouter(createAppRouteObjects()),
    [],
  );

  return <RouterProvider router={router} />;
}
