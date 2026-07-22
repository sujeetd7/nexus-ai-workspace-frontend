import { Loader, Stack, Text } from "@nexus/shared-ui";

/**
 * Route-level Suspense fallback (ready tree — SharedUI already mounted).
 * Distinct from startup Loading / StartupLoading.
 */
export function RouteLoading() {
  return (
    <Stack
      padding="xl"
      align="center"
      gap="md"
      accessibilityRole="progress"
      accessibilityLabel="Loading page"
      testID="route-loading"
    >
      <Loader accessibilityLabel="Loading page" />
      <Text>Loading page...</Text>
    </Stack>
  );
}
