import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader, Stack, Text } from "@nexus/shared-ui";
import { useSelector } from "react-redux";

import {
  selectAuthInitialized,
  selectAuthLoading,
  selectIsAuthenticated,
} from "../../store/slices/auth/selectors";
import { WEB_ROUTE_PATHS } from "../paths";

export interface ProtectedRouteProps extends PropsWithChildren {
  readonly redirectTo?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = WEB_ROUTE_PATHS.login,
}: ProtectedRouteProps) {
  const initialized = useSelector(selectAuthInitialized);
  const loading = useSelector(selectAuthLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!initialized || loading) {
    return (
      <Stack align="center" justify="center" padding="xl" gap="md">
        <Loader accessibilityLabel="Checking session" />
        <Text>Checking session…</Text>
      </Stack>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children;
}

export interface GuestRouteProps extends PropsWithChildren {
  readonly redirectTo?: string;
}

export function GuestRoute({
  children,
  redirectTo = WEB_ROUTE_PATHS.dashboard,
}: GuestRouteProps) {
  const initialized = useSelector(selectAuthInitialized);
  const loading = useSelector(selectAuthLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!initialized || loading) {
    return (
      <Stack align="center" justify="center" padding="xl" gap="md">
        <Loader accessibilityLabel="Loading" />
      </Stack>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
