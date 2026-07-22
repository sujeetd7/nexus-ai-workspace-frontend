import { Button, Section, Text } from "@nexus/shared-ui";
import { INFRASTRUCTURE_ROUTES, ROUTE_IDS } from "@nexus/shared-types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../navigation/types";
import { ApplicationShell } from "../../shell";

type Props = NativeStackScreenProps<RootStackParamList, "NotFound">;

const notFoundMeta = INFRASTRUCTURE_ROUTES[ROUTE_IDS.NOT_FOUND];

/**
 * Fallback / not-found infrastructure screen.
 */
export function NotFoundScreen({ navigation }: Props) {
  return (
    <ApplicationShell
      title={notFoundMeta.title ?? "Not Found"}
      testID="not-found-screen"
    >
      <Section gap="md" accessibilityRole="alert">
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
    </ApplicationShell>
  );
}
