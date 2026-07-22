import { Section, Stack, Text } from "@nexus/shared-ui";
import { INFRASTRUCTURE_ROUTES, ROUTE_IDS } from "@nexus/shared-types";

const homeMeta = INFRASTRUCTURE_ROUTES[ROUTE_IDS.HOME];

/**
 * Infrastructure home placeholder — validates navigation foundation only.
 */
export function HomePage() {
  return (
    <Section
      title={homeMeta.title ?? "Home"}
      testID="home-page"
      accessibilityLabel="Home"
    >
      <Stack gap="sm">
        <Text color="textSecondary">
          Platform shell is ready. Feature routes are not registered in this
          batch.
        </Text>
      </Stack>
    </Section>
  );
}
