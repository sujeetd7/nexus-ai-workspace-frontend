import { lazy } from "react";
import { ROUTE_IDS } from "@nexus/shared-types";

import { WEB_ROUTE_PATHS } from "../paths";
import type { RouteConfig } from "../types/RouteConfig";

export const profileRoutes: RouteConfig[] = [
  {
    id: ROUTE_IDS.PROFILE,
    path: WEB_ROUTE_PATHS.profile,
    element: lazy(() =>
      import("../../features/profile/screens/ProfileScreen").then((module) => ({
        default: module.ProfileScreen,
      })),
    ),
    auth: true,
  },
  {
    id: ROUTE_IDS.PROFILE_EDIT,
    path: WEB_ROUTE_PATHS.profileEdit,
    element: lazy(() =>
      import("../../features/profile/screens/EditProfileScreen").then(
        (module) => ({
          default: module.EditProfileScreen,
        }),
      ),
    ),
    auth: true,
  },
  {
    id: ROUTE_IDS.PROFILE_PREFERENCES,
    path: WEB_ROUTE_PATHS.profilePreferences,
    element: lazy(() =>
      import("../../features/profile/screens/PreferencesScreen").then(
        (module) => ({
          default: module.PreferencesScreen,
        }),
      ),
    ),
    auth: true,
  },
];
