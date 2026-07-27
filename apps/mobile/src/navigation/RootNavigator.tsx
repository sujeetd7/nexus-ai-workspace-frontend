import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { Loader, Stack, Text } from "@nexus/shared-ui";

import { HomeScreen, NotFoundScreen } from "../screens/system";
import { DashboardScreen, LoginScreen } from "../screens/auth";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { WorkspaceListScreen } from "../screens/workspaces/WorkspaceListScreen";
import {
  selectAuthInitialized,
  selectAuthLoading,
  selectIsAuthenticated,
} from "../store/slices/auth/selectors";
import type { RootStackParamList } from "./types";
import { MOBILE_ROUTE_NAMES } from "./types";

const NativeStack = createNativeStackNavigator<RootStackParamList>();

function AuthLoadingScreen() {
  return (
    <Stack align="center" justify="center" padding="xl" gap="md">
      <Loader accessibilityLabel="Checking session" />
      <Text>Checking session…</Text>
    </Stack>
  );
}

export function RootNavigator() {
  const initialized = useSelector(selectAuthInitialized);
  const loading = useSelector(selectAuthLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!initialized || loading) {
    return <AuthLoadingScreen />;
  }

  return (
    <NativeStack.Navigator
      initialRouteName={
        isAuthenticated ? MOBILE_ROUTE_NAMES.Dashboard : MOBILE_ROUTE_NAMES.Login
      }
      screenOptions={{ headerShown: false, animation: "fade" }}
    >
      {isAuthenticated ? (
        <>
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.Dashboard}
            component={DashboardScreen}
          />
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.Profile}
            component={ProfileScreen}
          />
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.Workspaces}
            component={WorkspaceListScreen}
          />
          <NativeStack.Screen
            name={MOBILE_ROUTE_NAMES.Home}
            component={HomeScreen}
          />
        </>
      ) : (
        <NativeStack.Screen
          name={MOBILE_ROUTE_NAMES.Login}
          component={LoginScreen}
        />
      )}
      <NativeStack.Screen
        name={MOBILE_ROUTE_NAMES.NotFound}
        component={NotFoundScreen}
      />
    </NativeStack.Navigator>
  );
}
