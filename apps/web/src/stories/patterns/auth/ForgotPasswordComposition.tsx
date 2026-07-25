import { useState, type FC } from "react";

import {
  AuthCard,
  AuthFooter,
  AuthShell,
  Button,
  FormField,
  InlineAlert,
  Text,
} from "@nexus/shared-ui";

export type ForgotPasswordCompositionState =
  | "default"
  | "submitting"
  | "disabled"
  | "fieldErrors"
  | "apiError"
  | "success";

export interface ForgotPasswordCompositionProps {
  state?: ForgotPasswordCompositionState;
}

/**
 * Storybook-only forgot-password composition — mock local state, no API.
 */
export const ForgotPasswordComposition: FC<ForgotPasswordCompositionProps> = ({
  state = "default",
}) => {
  const [email, setEmail] = useState(
    state === "fieldErrors" ? "bad" : "you@example.com",
  );

  const disabled = state === "disabled" || state === "submitting";
  const submitting = state === "submitting";
  const fieldErrors = state === "fieldErrors";
  const apiError = state === "apiError";
  const success = state === "success";

  return (
    <AuthShell
      testID="forgot-shell"
      brand={
        <Text variant="h2" align="center" weight="bold">
          Nexus
        </Text>
      }
    >
      <AuthCard
        testID="forgot-card"
        title="Forgot password"
        description="Enter your email and we'll send a reset link."
        status={
          apiError ? (
            <InlineAlert tone="error" title="Unable to send link">
              Something went wrong. Try again shortly.
            </InlineAlert>
          ) : success ? (
            <InlineAlert
              tone="success"
              title="Check your email"
              testID="forgot-success"
            >
              If an account exists for that address, a reset link is on the way.
            </InlineAlert>
          ) : undefined
        }
        footer={
          <AuthFooter
            link={{ label: "Back to sign in", href: "#sign-in" }}
          />
        }
      >
        {!success ? (
          <>
            <FormField
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              disabled={disabled}
              required
              autoComplete="email"
              inputMode="email"
              errorText={
                fieldErrors ? "Enter a valid email address" : undefined
              }
            />
            <Button
              fullWidth
              type="submit"
              loading={submitting}
              disabled={disabled && !submitting}
              onPress={() => undefined}
            >
              Send reset link
            </Button>
          </>
        ) : null}
      </AuthCard>
    </AuthShell>
  );
};
