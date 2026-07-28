import type { PropsWithChildren } from "react";
import { useCallback, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader, Stack, Text } from "@nexus/shared-ui";
import { useDispatch, useSelector } from "react-redux";

import { useGetCurrentUserQuery } from "../../api/services/user/userApi";
import { useListWorkspacesQuery } from "../../api/services/workspace/workspaceApi";
import { mapApiError } from "../../hooks/useApiErrorMessage";
import { WEB_ROUTE_PATHS } from "../paths";
import {
  classifySystemFailure,
  SystemFailureView,
  workspaceFailureCopy,
} from "../../system";
import type { AppDispatch } from "../../store/createAppStore";
import {
  selectAuthInitialized,
  selectAuthLoading,
  selectAuthStatus,
  selectIsAuthenticated,
} from "../../store/slices/auth/selectors";
import {
  sessionExpiredAcknowledged,
} from "../../store/slices/auth/authSlice";
import { createLogoutAction } from "../../store/sagas/auth/authSaga";
import {
  selectIsWorkspaceReady,
  selectSelectedWorkspaceId,
  selectWorkspaceError,
  selectWorkspaceStatus,
} from "../../store/slices/workspace/selectors";

export interface ProtectedRouteProps extends PropsWithChildren {
  readonly redirectTo?: string;
}

function isWorkspaceSelectionPath(pathname: string): boolean {
  return (
    pathname === WEB_ROUTE_PATHS.workspaces ||
    pathname === WEB_ROUTE_PATHS.workspaceCreate ||
    pathname.startsWith("/invitations")
  );
}

function WorkspaceBootstrapFailure() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const workspaceError = useSelector(selectWorkspaceError);
  const {
    error: listError,
    refetch: refetchList,
    isFetching: listFetching,
  } = useListWorkspacesQuery();
  const {
    error: profileError,
    refetch: refetchProfile,
    isFetching: profileFetching,
  } = useGetCurrentUserQuery();
  const [retrying, setRetrying] = useState(false);

  const sourceError = profileError ?? listError;
  const mapped = sourceError ? mapApiError(sourceError) : undefined;
  const presentation = classifySystemFailure(
    mapped
      ? {
          status: mapped.status,
          code: mapped.code,
          message: mapped.message,
          causeType: mapped.causeType,
          retryable: mapped.retryable,
          authAction: mapped.authAction,
          authorizationAction: mapped.authorizationAction,
          context: "authenticated",
        }
      : {
          message: workspaceError ?? "Workspace bootstrap failed.",
          context: "authenticated",
        },
  );
  const copy = workspaceFailureCopy(presentation.kind, presentation.message);
  const busy = retrying || listFetching || profileFetching;

  const onRetry = useCallback(() => {
    setRetrying(true);
    const tasks: Array<Promise<unknown>> = [];
    if (profileError) {
      tasks.push(Promise.resolve(refetchProfile()));
    }
    tasks.push(Promise.resolve(refetchList()));
    void Promise.all(tasks).finally(() => {
      setRetrying(false);
    });
  }, [profileError, refetchList, refetchProfile]);

  const onSignIn = useCallback(() => {
    dispatch(sessionExpiredAcknowledged());
    void navigate(WEB_ROUTE_PATHS.login, { replace: true });
  }, [dispatch, navigate]);

  const onSignOut = useCallback(() => {
    dispatch(createLogoutAction());
  }, [dispatch]);

  return (
    <SystemFailureView
      testID="workspace-bootstrap-error"
      layout="inline"
      busy={busy}
      presentation={{
        ...presentation,
        title: copy.title,
        message: copy.message,
      }}
      onSignIn={
        presentation.primaryAction === "signIn" ? onSignIn : undefined
      }
      onRetry={presentation.primaryAction === "retry" ? onRetry : undefined}
      onSignOut={
        presentation.secondaryAction === "signOut" ? onSignOut : undefined
      }
    />
  );
}

export function ProtectedRoute({
  children,
  redirectTo = WEB_ROUTE_PATHS.login,
}: ProtectedRouteProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const initialized = useSelector(selectAuthInitialized);
  const loading = useSelector(selectAuthLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authStatus = useSelector(selectAuthStatus);
  const workspaceStatus = useSelector(selectWorkspaceStatus);
  const workspaceReady = useSelector(selectIsWorkspaceReady);
  const selectedWorkspaceId = useSelector(selectSelectedWorkspaceId);
  const location = useLocation();

  if (!initialized || loading) {
    return (
      <Stack align="center" justify="center" padding="xl" gap="md">
        <Loader accessibilityLabel="Checking session" />
        <Text>Checking session…</Text>
      </Stack>
    );
  }

  if (authStatus === "session-expired") {
    const presentation = classifySystemFailure({
      status: 401,
      authAction: "reauthenticate",
      context: "authenticated",
    });

    return (
      <SystemFailureView
        testID="session-expired"
        presentation={presentation}
        onSignIn={() => {
          dispatch(sessionExpiredAcknowledged());
          void navigate(redirectTo, {
            replace: true,
            state: { from: location, reason: "session-expired" },
          });
        }}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location, reason: "unauthorized" }}
      />
    );
  }

  if (
    workspaceStatus === "uninitialized" ||
    workspaceStatus === "loading" ||
    !workspaceReady
  ) {
    if (workspaceStatus === "error") {
      return <WorkspaceBootstrapFailure />;
    }

    return (
      <Stack align="center" justify="center" padding="xl" gap="md">
        <Loader accessibilityLabel="Loading workspaces" />
        <Text>Preparing your workspace…</Text>
      </Stack>
    );
  }

  if (
    !selectedWorkspaceId &&
    !isWorkspaceSelectionPath(location.pathname)
  ) {
    return <Navigate to={WEB_ROUTE_PATHS.workspaces} replace />;
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
