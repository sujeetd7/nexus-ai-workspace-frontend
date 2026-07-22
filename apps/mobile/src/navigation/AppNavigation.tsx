import { NavigationContainer } from "@react-navigation/native";

import { navigationLinking } from "./linking";
import { RootNavigator } from "./RootNavigator";

/**
 * Single application-owned NavigationContainer.
 * Mounted once under Redux after bootstrap providers.
 */
export function AppNavigation() {
  return (
    <NavigationContainer linking={navigationLinking}>
      <RootNavigator />
    </NavigationContainer>
  );
}
