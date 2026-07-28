import { Button, Section, Text } from "@nexus/shared-ui";
import { INFRASTRUCTURE_ROUTES, ROUTE_IDS } from "@nexus/shared-types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  MOBILE_ROUTE_NAMES,
  type RootStackParamList,
} from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "NotFound">;

const notFoundMeta = INFRASTRUCTURE_ROUTES[ROUTE_IDS.NOT_FOUND];

/**
 * Fallback / not-found infrastructure screen — content only (guest-safe).
 * Home exists only on the authenticated stack; guests recover to Login.
 */
export function NotFoundScreen({ navigation }: Props) {
  const routeNames = navigation.getState().routeNames;
  const canGoHome = routeNames.includes(MOBILE_ROUTE_NAMES.Home);
  const recoveryLabel = canGoHome ? "Go to home" : "Go to sign in";

  return (
    <Section gap="md" testID="not-found-screen" accessibilityRole="alert">
      <Text variant="h2" accessibilityRole="heading">
        {notFoundMeta.title ?? "Not Found"}
      </Text>
      <Text color="textSecondary">
        The requested screen could not be found.
      </Text>
      <Button
        onPress={() => {
          if (canGoHome) {
            navigation.navigate(MOBILE_ROUTE_NAMES.Home);
            return;
          }
          if (routeNames.includes(MOBILE_ROUTE_NAMES.Login)) {
            navigation.navigate(MOBILE_ROUTE_NAMES.Login);
            return;
          }
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
        accessibilityLabel={recoveryLabel}
      >
        {recoveryLabel}
      </Button>
    </Section>
  );
}
