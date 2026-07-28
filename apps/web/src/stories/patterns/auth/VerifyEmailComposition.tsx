import { useState, type FC } from "react";

import {
  AuthCard,
  AuthFooter,
  AuthShell,
  Button,
  InlineAlert,
  Loader,
  Stack,
  Text,
} from "@nexus/shared-ui";

export type VerifyEmailCompositionState =
  | "loading"
  | "success"
  | "apiError"
  | "invalidToken"
  | "expiredToken";

export interface VerifyEmailCompositionProps {
  state?: VerifyEmailCompositionState;
}

/**
 * Storybook-only verify-email composition — mock states, no API.
 */
export const VerifyEmailComposition: FC<VerifyEmailCompositionProps> = ({
  state = "loading",
}) => {
  const [retried, setRetried] = useState(false);
  const loading = state === "loading";
  const success = state === "success";
  const apiError = state === "apiError";
  const invalidToken = state === "invalidToken";
  const expiredToken = state === "expiredToken";

  return (
    <AuthShell
      testID="verify-shell"
      brand={
        <Text variant="h2" align="center" weight="bold">
          Nexus AI Workspace
        </Text>
      }
    >
      <AuthCard
        testID="verify-card"
        title="Verify email"
        description={
          loading
            ? "Confirming your email address."
            : success
              ? "Your email is confirmed."
              : "We could not verify this email link."
        }
        headingLevel={2}
        status={
          loading ? (
            <Stack align="center">
              <Loader accessibilityLabel="Verifying email" />
            </Stack>
          ) : invalidToken ? (
            <InlineAlert
              tone="error"
              title="Invalid link"
              testID="verify-invalid-token"
            >
              This verification link is invalid. Request a new email.
            </InlineAlert>
          ) : expiredToken ? (
            <InlineAlert
              tone="warning"
              title="Link expired"
              testID="verify-expired-token"
            >
              This verification link has expired. Request a new email.
            </InlineAlert>
          ) : apiError ? (
            <InlineAlert
              tone="error"
              title="Verification failed"
              testID="verify-api-error"
            >
              Something went wrong. Please try again.
            </InlineAlert>
          ) : success ? (
            <InlineAlert
              tone="success"
              title="Email verified"
              testID="verify-success"
            >
              Your email has been verified.
            </InlineAlert>
          ) : undefined
        }
        footer={
          <AuthFooter
            link={{
              label: success ? "Continue to sign in" : "Back to sign in",
              href: "#sign-in",
            }}
          />
        }
      >
        {!loading && !success ? (
          <Button
            fullWidth
            variant="secondary"
            type="button"
            onPress={() => setRetried(true)}
          >
            {retried ? "Retrying…" : "Try again"}
          </Button>
        ) : null}
      </AuthCard>
    </AuthShell>
  );
};
