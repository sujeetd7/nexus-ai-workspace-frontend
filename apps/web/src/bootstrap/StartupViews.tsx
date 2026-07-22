import {
  Button,
  Loader,
  SharedUIProvider,
  Stack,
  Text,
  THEME_PREFERENCE_STORAGE_KEY,
} from "@nexus/shared-ui";
import type { BootstrapFailure, StorageAdapter } from "@nexus/shared-types";

import { createLocalStorageAdapter } from "../platform/storage";

export interface StartupLoadingProps {
  readonly label?: string;
}

/**
 * Pre-Redux startup loading. Uses a minimal SharedUIProvider for primitives only.
 */
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
  let themeStorage: StorageAdapter | undefined;
  try {
    themeStorage = createLocalStorageAdapter();
  } catch {
    themeStorage = undefined;
  }

  return (
    <SharedUIProvider
      defaultPreference="system"
      storage={themeStorage}
      storageKey={themeStorage ? THEME_PREFERENCE_STORAGE_KEY : undefined}
    >
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
