import { useNavigate } from "react-router-dom";
import { Button, Section, Stack, Text } from "@nexus/shared-ui";
import { INFRASTRUCTURE_ROUTES, ROUTE_IDS } from "@nexus/shared-types";

const notFoundMeta = INFRASTRUCTURE_ROUTES[ROUTE_IDS.NOT_FOUND];

/**
 * Catch-all unknown path surface — distinct from route execution failures.
 */
export function NotFound() {
  const navigate = useNavigate();

  return (
    <Section
      title={notFoundMeta.title ?? "Not Found"}
      testID="not-found-page"
      accessibilityLabel="Page not found"
      accessibilityRole="alert"
    >
      <Stack gap="md" align="start">
        <Text color="textSecondary">
          The requested page could not be found.
        </Text>
        <Button
          onPress={() => {
            void navigate("/");
          }}
          accessibilityLabel="Go to home"
        >
          Go to home
        </Button>
      </Stack>
    </Section>
  );
}
