import { Button, Section, Stack, Text } from "@nexus/shared-ui";
import { INFRASTRUCTURE_ROUTES, ROUTE_IDS } from "@nexus/shared-types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../navigation/types";
import { ApplicationShell } from "../../shell";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const homeMeta = INFRASTRUCTURE_ROUTES[ROUTE_IDS.HOME];

/**
 * Infrastructure home placeholder — validates navigation foundation only.
 */
export function HomeScreen({ navigation }: Props) {
  return (
    <ApplicationShell title={homeMeta.title ?? "Home"} testID="home-screen">
      <Section gap="md">
        <Text color="textSecondary">
          Platform shell is ready. Feature routes are not registered in this
          batch.
        </Text>
        <Stack gap="sm">
          <Button
            onPress={() => {
              navigation.navigate("NotFound");
            }}
            accessibilityLabel="Open not found screen"
          >
            Open not found
          </Button>
        </Stack>
      </Section>
    </ApplicationShell>
  );
}
