import { useCallback, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { Loader, Stack, Text } from "@nexus/shared-ui";

import { useGetCurrentUserQuery } from "../api/services/user/userApi";
import { useListWorkspacesQuery } from "../api/services/workspace/workspaceApi";
import { mapApiError } from "../hooks/useApiErrorMessage";
import { getMobileSession } from "../api/client/axios";
import { HomeScreen, NotFoundScreen } from "../screens/system";
import {
  DashboardScreen,
  ForgotPasswordScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  VerifyEmailScreen,
} from "../screens/auth";
import {
  EditProfileScreen,
  PreferencesScreen,
  ProfileScreen,
} from "../screens/profile";
import { createShellScreen } from "../screens/AppShell";
import {
  AcceptInvitationScreen,
  InviteMemberScreen,
  WorkspaceDetailScreen,
  WorkspaceInvitationsScreen,
  WorkspaceListScreen,
  WorkspaceMembersScreen,
} from "../screens/workspaces";
import {
  classifySystemFailure,
  SystemFailureView,
  workspaceFailureCopy,
} from "../system";
import type { AppDispatch } from "../store/createAppStore";
import {
  selectAuthInitialized,
  selectAuthLoading,
  selectAuthStatus,
  selectIsAuthenticated,
} from "../store/slices/auth/selectors";
import {
  sessionExpiredAcknowledged,
  logoutCompleted,
} from "../store/slices/auth/authSlice";
import {
  selectIsWorkspaceReady,
  selectSelectedWorkspaceId,
  selectWorkspaceError,
  selectWorkspaceStatus,
} from "../store/slices/workspace/selectors";
import type { RootStackParamList } from "./types";
import { MOBILE_ROUTE_NAMES } from "./types";

const NativeStack = createNativeStackNavigator<RootStackParamList>();

const ShellDashboardScreen = createShellScreen(DashboardScreen);
const ShellWorkspaceListScreen = createShellScreen(WorkspaceListScreen);
const ShellWorkspaceDetailScreen = createShellScreen(WorkspaceDetailScreen);
const ShellWorkspaceMembersScreen = createShellScreen(WorkspaceMembersScreen);
const ShellWorkspaceInvitationsScreen = createShellScreen(
  WorkspaceInvitationsScreen,
);
const ShellInviteMemberScreen = createShellScreen(InviteMemberScreen);
const ShellAcceptInvitationScreen = createShellScreen(AcceptInvitationScreen);
const ShellProfileScreen = createShellScreen(ProfileScreen);
const ShellEditProfileScreen = createShellScreen(EditProfileScreen);
const ShellPreferencesScreen = createShellScreen(PreferencesScreen);
const ShellHomeScreen = createShellScreen(HomeScreen);

function AuthLoadingScreen() {
  return (
    <Stack align="center" justify="center" padding="xl" gap="md">
      <Loader accessibilityLabel="Checking session" />
      <Text>Checking session…</Text>
    </Stack>
  );
}

function WorkspaceBootstrapLoadingScreen() {
  return (
    <Stack align="center" justify="center" padding="xl" gap="md">
      <Loader accessibilityLabel="Loading workspaces" />
      <Text>Preparing your workspace…</Text>
    </Stack>
  );
}

function SessionExpiredScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const presentation = classifySystemFailure({
    status: 401,
    authAction: "reauthenticate",
    context: "authenticated",
  });

  return (
    <SystemFailureView
      testID="mobile-session-expired"
      presentation={presentation}
      onSignIn={() => {
        dispatch(sessionExpiredAcknowledged());
      }}
    />
  );
}

function WorkspaceBootstrapErrorScreen() {
  const dispatch = useDispatch<AppDispatch>();
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
  }, [dispatch]);

  const onSignOut = useCallback(() => {
    void (async () => {
      try {
        await getMobileSession().logout();
      } finally {
        dispatch(logoutCompleted());
      }
    })();
  }, [dispatch]);

  return (
    <SystemFailureView
      testID="mobile-workspace-bootstrap-error"
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

export function RootNavigator() {
  const initialized = useSelector(selectAuthInitialized);
  const loading = useSelector(selectAuthLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authStatus = useSelector(selectAuthStatus);
  const workspaceStatus = useSelector(selectWorkspaceStatus);
  const workspaceReady = useSelector(selectIsWorkspaceReady);
  const selectedWorkspaceId = useSelector(selectSelectedWorkspaceId);

  if (!initialized || loading) {
    return <AuthLoadingScreen />;
  }

  if (authStatus === "session-expired") {
    return <SessionExpiredScreen />;
  }

  if (isAuthenticated) {
    if (workspaceStatus === "error") {
      return <WorkspaceBootstrapErrorScreen />;
    }

    if (
      workspaceStatus === "uninitialized" ||
      workspaceStatus === "loading" ||
      !workspaceReady
    ) {
      return <WorkspaceBootstrapLoadingScreen />;
    }
  }

  const authenticatedInitial =
    selectedWorkspaceId != null
      ? MOBILE_ROUTE_NAMES.Dashboard
      : MOBILE_ROUTE_NAMES.Workspaces;

  return (
    <NativeStack.Navigator
      initialRouteName={
        isAuthenticated ? authenticatedInitial : MOBILE_ROUTE_NAMES.Login
      }
      screenOptions={{ headerShown: false, animation: "fade" }}
    >
      {isAuthenticated ? (
        <>
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.Workspaces}
            component={ShellWorkspaceListScreen}
          />
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.WorkspaceDetail}
            component={ShellWorkspaceDetailScreen}
          />
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.WorkspaceMembers}
            component={ShellWorkspaceMembersScreen}
          />
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.WorkspaceInvitations}
            component={ShellWorkspaceInvitationsScreen}
          />
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.WorkspaceInvite}
            component={ShellInviteMemberScreen}
          />
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.AcceptInvitation}
            component={ShellAcceptInvitationScreen}
          />
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.Dashboard}
            component={ShellDashboardScreen}
          />
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.Profile}
            component={ShellProfileScreen}
          />
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.ProfileEdit}
            component={ShellEditProfileScreen}
          />
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.ProfilePreferences}
            component={ShellPreferencesScreen}
          />
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.Home}
            component={ShellHomeScreen}
          />
        </>
      ) : (
        <>
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.Login}
            component={LoginScreen}
          />
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.Register}
            component={RegisterScreen}
          />
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.ForgotPassword}
            component={ForgotPasswordScreen}
          />
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.ResetPassword}
            component={ResetPasswordScreen}
          />
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.VerifyEmail}
            component={VerifyEmailScreen}
          />
        </>
      )}
      <NativeStack.Screen
        name={MOBILE_ROUTE_NAMES.NotFound}
        component={NotFoundScreen}
      />
    </NativeStack.Navigator>
  );
}
