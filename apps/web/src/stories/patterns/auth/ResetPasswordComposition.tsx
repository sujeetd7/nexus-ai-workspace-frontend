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

export type ResetPasswordCompositionState =
  | "default"
  | "submitting"
  | "disabled"
  | "fieldErrors"
  | "apiError"
  | "invalidToken"
  | "expiredToken"
  | "success";

export interface ResetPasswordCompositionProps {
  state?: ResetPasswordCompositionState;
}

/**
 * Storybook-only reset-password composition — mock local state, no API.
 */
export const ResetPasswordComposition: FC<ResetPasswordCompositionProps> = ({
  state = "default",
}) => {
  const [password, setPassword] = useState(
    state === "fieldErrors" ? "123" : "newpassword123",
  );
  const [confirm, setConfirm] = useState(
    state === "fieldErrors" ? "456" : "newpassword123",
  );

  const disabled = state === "disabled" || state === "submitting";
  const submitting = state === "submitting";
  const fieldErrors = state === "fieldErrors";
  const apiError = state === "apiError";
  const invalidToken = state === "invalidToken";
  const expiredToken = state === "expiredToken";
  const success = state === "success";
  const tokenBlocked = invalidToken || expiredToken;

  return (
    <AuthShell
      testID="reset-shell"
      brand={
        <Text variant="h2" align="center" weight="bold">
          Nexus
        </Text>
      }
    >
      <AuthCard
        testID="reset-card"
        title="Reset password"
        description={
          tokenBlocked
            ? "This reset link cannot be used."
            : "Choose a new password for your account."
        }
        status={
          invalidToken ? (
            <InlineAlert
              tone="error"
              title="Invalid link"
              testID="reset-invalid-token"
            >
              This password reset link is invalid. Request a new one.
            </InlineAlert>
          ) : expiredToken ? (
            <InlineAlert
              tone="warning"
              title="Link expired"
              testID="reset-expired-token"
            >
              This password reset link has expired. Request a new one.
            </InlineAlert>
          ) : apiError ? (
            <InlineAlert tone="error" title="Unable to reset password" testID="reset-api-error">
              Something went wrong. Please try again.
            </InlineAlert>
          ) : success ? (
            <InlineAlert
              tone="success"
              title="Password updated"
              testID="reset-success"
            >
              Your password has been changed. You can sign in now.
            </InlineAlert>
          ) : undefined
        }
        footer={
          <AuthFooter
            link={{
              label: tokenBlocked ? "Request a new link" : "Back to sign in",
              href: tokenBlocked ? "#forgot-password" : "#sign-in",
            }}
          />
        }
      >
        {!tokenBlocked && !success ? (
          <>
            <FormField
              testID="reset-password"
              label="New password"
              placeholder="Create a new password"
              value={password}
              onChangeText={setPassword}
              disabled={disabled}
              required
              secureTextEntry
              autoComplete="new-password"
              errorText={
                fieldErrors
                  ? "Password must be at least 8 characters"
                  : undefined
              }
            />
            <FormField
              testID="reset-confirm"
              label="Confirm password"
              placeholder="Re-enter your password"
              value={confirm}
              onChangeText={setConfirm}
              disabled={disabled}
              required
              secureTextEntry
              autoComplete="new-password"
              errorText={fieldErrors ? "Passwords do not match" : undefined}
            />
            <Button
              testID="reset-submit"
              fullWidth
              type="submit"
              loading={submitting}
              disabled={disabled && !submitting}
              onPress={() => undefined}
            >
              Update password
            </Button>
          </>
        ) : null}
      </AuthCard>
    </AuthShell>
  );
};
