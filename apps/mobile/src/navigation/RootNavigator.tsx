import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen, NotFoundScreen } from "../screens/system";
import type { RootStackParamList } from "./types";
import { MOBILE_ROUTE_NAMES } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Single native-stack root navigator — infrastructure routes only.
 */
export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={MOBILE_ROUTE_NAMES.Home}
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen
        name={MOBILE_ROUTE_NAMES.Home}
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name={MOBILE_ROUTE_NAMES.NotFound}
        component={NotFoundScreen}
        options={{ title: "Not Found" }}
      />
    </Stack.Navigator>
  );
}
