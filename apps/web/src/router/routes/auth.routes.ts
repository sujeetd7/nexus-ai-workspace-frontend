import { lazy } from "react";
import { ROUTE_IDS } from "@nexus/shared-types";

import { WEB_ROUTE_PATHS } from "../paths";
import type { RouteConfig } from "../types/RouteConfig";

export const authRoutes: RouteConfig[] = [
  {
    id: ROUTE_IDS.LOGIN,
    path: WEB_ROUTE_PATHS.login,
    element: lazy(() =>
      import("../../features/auth/screens/LoginScreen").then((module) => ({
        default: module.LoginScreen,
      })),
    ),
    auth: false,
  },
  {
    id: ROUTE_IDS.REGISTER,
    path: WEB_ROUTE_PATHS.register,
    element: lazy(() =>
      import("../../features/auth/screens/RegisterScreen").then((module) => ({
        default: module.RegisterScreen,
      })),
    ),
    auth: false,
  },
  {
    id: ROUTE_IDS.FORGOT_PASSWORD,
    path: WEB_ROUTE_PATHS.forgotPassword,
    element: lazy(() =>
      import("../../features/auth/screens/ForgotPasswordScreen").then(
        (module) => ({
          default: module.ForgotPasswordScreen,
        }),
      ),
    ),
    auth: false,
  },
  {
    id: ROUTE_IDS.RESET_PASSWORD,
    path: WEB_ROUTE_PATHS.resetPassword,
    element: lazy(() =>
      import("../../features/auth/screens/ResetPasswordScreen").then(
        (module) => ({
          default: module.ResetPasswordScreen,
        }),
      ),
    ),
    auth: false,
  },
  {
    id: ROUTE_IDS.VERIFY_EMAIL,
    path: WEB_ROUTE_PATHS.verifyEmail,
    element: lazy(() =>
      import("../../features/auth/screens/VerifyEmailScreen").then((module) => ({
        default: module.VerifyEmailScreen,
      })),
    ),
    auth: false,
  },
];
