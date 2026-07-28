import { Button, Section, Text } from "@nexus/shared-ui";
import { INFRASTRUCTURE_ROUTES, ROUTE_IDS } from "@nexus/shared-types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "NotFound">;

const notFoundMeta = INFRASTRUCTURE_ROUTES[ROUTE_IDS.NOT_FOUND];

/**
 * Fallback / not-found infrastructure screen — content only (guest-safe).
 */
export function NotFoundScreen({ navigation }: Props) {
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
          navigation.navigate("Home");
        }}
        accessibilityLabel="Go to home"
      >
        Go to home
      </Button>
    </Section>
  );
}
