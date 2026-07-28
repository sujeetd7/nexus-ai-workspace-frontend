import { useEffect, useMemo, useState, type FC, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AuthCard,
  AuthFooter,
  AuthShell,
  Button,
  FormField,
  InlineAlert,
  Stack,
} from "@nexus/shared-ui";
import { resetPasswordRequestSchema } from "@nexus/shared-validation";

import { getWebAuthClient } from "../../../api/auth/createWebAuthClient";
import { WEB_ROUTE_PATHS } from "../../../router/paths";
import { AuthBrand } from "../components/AuthBrand";
import { mapApiError } from "../hooks/useApiErrorMessage";
import { useAuthForm } from "../hooks/useAuthForm";
import type { MappedAuthError } from "../utils/authErrorPresentation";
import {
  focusAuthStatus,
  focusFirstFieldError,
} from "../utils/focusAuthFeedback";

export const ResetPasswordScreen: FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const missingToken = token.length === 0;
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<MappedAuthError | undefined>();
  const [success, setSuccess] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState<string | undefined>();
  const form = useAuthForm({
    schema: resetPasswordRequestSchema,
    initialValues: { token, password: "" },
  });

  const tokenBlocked = useMemo(() => {
    if (missingToken) {
      return "invalidToken" as const;
    }
    if (apiError?.kind === "expiredToken") {
      return "expiredToken" as const;
    }
    if (apiError?.kind === "invalidToken") {
      return "invalidToken" as const;
    }
    return undefined;
  }, [apiError, missingToken]);

  useEffect(() => {
    if (apiError && !tokenBlocked) {
      focusAuthStatus("reset");
    }
  }, [apiError, tokenBlocked]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (tokenBlocked) {
      return;
    }

    const result = form.validate();
    let nextConfirmError: string | undefined;
    if (!confirmPassword) {
      nextConfirmError = "Confirm your password";
    } else if (confirmPassword !== form.values.password) {
      nextConfirmError = "Passwords do not match";
    }
    setConfirmError(nextConfirmError);

    if (!result.ok || nextConfirmError) {
      focusFirstFieldError(
        {
          ...(result.errors as Partial<Record<string, string>>),
          confirmPassword: nextConfirmError,
        },
        ["password", "confirmPassword"],
        "reset",
      );
      return;
    }

    setLoading(true);
    setApiError(undefined);

    try {
      await getWebAuthClient().resetPassword({
        token: form.values.token,
        password: form.values.password,
      });
      setSuccess(true);
      form.reset();
      setConfirmPassword("");
    } catch (error) {
      setApiError(mapApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell testID="reset-password-shell" brand={<AuthBrand />}>
      <AuthCard
        testID="reset-card"
        title="Reset password"
        description={
          tokenBlocked
            ? "This reset link cannot be used."
            : "Choose a new password for your account."
        }
        headingLevel={2}
        status={
          tokenBlocked === "invalidToken" ? (
            <InlineAlert
              tone="error"
              title="Invalid link"
              testID="reset-invalid-token"
            >
              {apiError?.message ??
                "This password reset link is invalid. Request a new one."}
            </InlineAlert>
          ) : tokenBlocked === "expiredToken" ? (
            <InlineAlert
              tone="warning"
              title="Link expired"
              testID="reset-expired-token"
            >
              {apiError?.message ??
                "This password reset link has expired. Request a new one."}
            </InlineAlert>
          ) : apiError ? (
            <InlineAlert
              tone="error"
              title={
                apiError.kind === "network"
                  ? "Connection problem"
                  : "Unable to reset password"
              }
              testID="reset-api-error"
            >
              {apiError.message}
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
              href: tokenBlocked
                ? WEB_ROUTE_PATHS.forgotPassword
                : WEB_ROUTE_PATHS.login,
            }}
          />
        }
      >
        {!tokenBlocked && !success ? (
          <form onSubmit={onSubmit} noValidate>
            <Stack gap="md">
              <FormField
                testID="reset-password"
                label="New password"
                placeholder="Create a new password"
                value={form.values.password}
                onChangeText={(value) => form.setField("password", value)}
                disabled={loading}
                required
                secureTextEntry
                autoComplete="new-password"
                errorText={form.fieldErrors.password}
              />
              <FormField
                testID="reset-confirmPassword"
                label="Confirm password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  setConfirmError(undefined);
                }}
                disabled={loading}
                required
                secureTextEntry
                autoComplete="new-password"
                errorText={confirmError}
              />
              {apiError?.retryable ? (
                <Button
                  testID="reset-retry"
                  fullWidth
                  variant="secondary"
                  type="button"
                  disabled={loading}
                  onPress={() => setApiError(undefined)}
                >
                  Try again
                </Button>
              ) : null}
              <Button
                testID="reset-submit"
                fullWidth
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Update password
              </Button>
            </Stack>
          </form>
        ) : null}
      </AuthCard>
    </AuthShell>
  );
};
