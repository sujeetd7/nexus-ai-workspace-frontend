import {
  Button,
  Loader,
  SharedUIProvider,
  Stack,
  Text,
} from "@nexus/shared-ui";
import type { BootstrapFailure } from "@nexus/shared-types";

export interface StartupLoadingProps {
  readonly label?: string;
}

export function StartupLoading({
  label = "Starting application",
}: StartupLoadingProps) {
  return (
    <SharedUIProvider defaultPreference="system">
      <Stack
        padding="xl"
        align="center"
        justify="center"
        gap="md"
        accessibilityRole="progress"
        accessibilityLabel={label}
      >
        <Loader accessibilityLabel={label} />
        <Text>{label}</Text>
      </Stack>
    </SharedUIProvider>
  );
}

export interface StartupFailureProps {
  readonly failure: BootstrapFailure;
  readonly onRetry?: () => void;
}

export function StartupFailure({ failure, onRetry }: StartupFailureProps) {
  return (
    <SharedUIProvider defaultPreference="system">
      <Stack
        padding="xl"
        align="center"
        justify="center"
        gap="md"
        accessibilityRole="alert"
        accessibilityLabel={failure.message}
      >
        <Text>{failure.message}</Text>
        {failure.retryable && onRetry ? (
          <Button onPress={onRetry}>Retry</Button>
        ) : null}
      </Stack>
    </SharedUIProvider>
  );
}
