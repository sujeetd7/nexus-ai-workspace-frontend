import { Loader, Stack, Text } from "@nexus/shared-ui";

/**
 * Suspense fallback inside the ready provider tree (SharedUI already mounted).
 */
export function Loading() {
  return (
    <Stack
      padding="xl"
      align="center"
      gap="md"
      accessibilityRole="progress"
      accessibilityLabel="Loading"
    >
      <Loader accessibilityLabel="Loading" />
      <Text>Loading...</Text>
    </Stack>
  );
}
