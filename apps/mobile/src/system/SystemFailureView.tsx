import type { FC } from "react";
import { Button, EmptyState, InlineAlert, Stack } from "@nexus/shared-ui";

import type { SystemFailurePresentation } from "./classifySystemFailure";

export interface SystemFailureViewProps {
  readonly presentation: SystemFailurePresentation;
  readonly testID?: string;
  readonly busy?: boolean;
  readonly layout?: "page" | "inline";
  readonly onSignIn?: () => void;
  readonly onRetry?: () => void;
  readonly onSignOut?: () => void;
  readonly onGoBack?: () => void;
}

/**
 * App-owned composition for blocking system auth/failure states.
 * Reuses shared-ui EmptyState / InlineAlert / Button only.
 */
export const SystemFailureView: FC<SystemFailureViewProps> = ({
  presentation,
  testID = "system-failure",
  busy = false,
  layout = "page",
  onSignIn,
  onRetry,
  onSignOut,
  onGoBack,
}) => {
  const primary =
    presentation.primaryAction === "signIn" && onSignIn ? (
      <Button
        onPress={onSignIn}
        disabled={busy}
        accessibilityLabel="Sign in"
        testID={`${testID}-sign-in`}
      >
        Sign in
      </Button>
    ) : presentation.primaryAction === "retry" && onRetry ? (
      <Button
        onPress={onRetry}
        loading={busy}
        disabled={busy}
        accessibilityLabel="Retry"
        testID={`${testID}-retry`}
      >
        Retry
      </Button>
    ) : undefined;

  const secondary =
    presentation.secondaryAction === "signOut" && onSignOut ? (
      <Button
        variant="secondary"
        onPress={onSignOut}
        disabled={busy}
        accessibilityLabel="Sign out"
        testID={`${testID}-sign-out`}
      >
        Sign out
      </Button>
    ) : presentation.secondaryAction === "goBack" && onGoBack ? (
      <Button
        variant="secondary"
        onPress={onGoBack}
        disabled={busy}
        accessibilityLabel="Go back"
        testID={`${testID}-go-back`}
      >
        Go back
      </Button>
    ) : undefined;

  if (layout === "inline") {
    return (
      <Stack
        padding="xl"
        gap="md"
        testID={testID}
        accessibilityRole="alert"
        accessibilityLabel={presentation.title}
      >
        <InlineAlert
          tone={presentation.tone}
          title={presentation.title}
          testID={`${testID}-alert`}
        >
          {presentation.message}
        </InlineAlert>
        {primary}
        {secondary}
      </Stack>
    );
  }

  return (
    <Stack
      padding="xl"
      gap="md"
      align="center"
      justify="center"
      testID={testID}
      accessibilityRole="alert"
      accessibilityLabel={presentation.title}
    >
      <EmptyState
        testID={`${testID}-empty`}
        title={presentation.title}
        description={presentation.message}
        primaryAction={primary}
        secondaryAction={secondary}
        accessibilityLabel={presentation.title}
      />
    </Stack>
  );
};
