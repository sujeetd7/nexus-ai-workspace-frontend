import { useEffect, useState, type FC, type FormEvent } from "react";
import {
  AuthCard,
  AuthFooter,
  AuthShell,
  Button,
  FormField,
  InlineAlert,
  Stack,
} from "@nexus/shared-ui";
import { forgotPasswordRequestSchema } from "@nexus/shared-validation";

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

export const ForgotPasswordScreen: FC = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<MappedAuthError | undefined>();
  const [success, setSuccess] = useState(false);
  const form = useAuthForm({
    schema: forgotPasswordRequestSchema,
    initialValues: { email: "" },
  });

  useEffect(() => {
    if (apiError) {
      focusAuthStatus("forgot");
    }
  }, [apiError]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = form.validate();
    if (!result.ok) {
      focusFirstFieldError(
        result.errors as Partial<Record<string, string>>,
        ["email"],
        "forgot",
      );
      return;
    }

    setLoading(true);
    setApiError(undefined);

    try {
      await getWebAuthClient().forgotPassword({ email: form.values.email });
      setSuccess(true);
      form.reset();
    } catch (error) {
      setApiError(mapApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const onRetry = () => {
    setApiError(undefined);
    setSuccess(false);
  };

  return (
    <AuthShell testID="forgot-password-shell" brand={<AuthBrand />}>
      <AuthCard
        testID="forgot-card"
        title="Forgot password"
        description="We'll email reset instructions if the account exists."
        headingLevel={2}
        status={
          apiError ? (
            <InlineAlert
              tone="error"
              title={
                apiError.kind === "network"
                  ? "Connection problem"
                  : "Unable to send link"
              }
              testID="forgot-api-error"
            >
              {apiError.message}
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
            link={{ label: "Back to sign in", href: WEB_ROUTE_PATHS.login }}
          />
        }
      >
        {!success ? (
          <form onSubmit={onSubmit} noValidate>
            <Stack gap="md">
              <FormField
                testID="forgot-email"
                label="Email"
                placeholder="you@example.com"
                value={form.values.email}
                onChangeText={(value) => form.setField("email", value)}
                disabled={loading}
                required
                autoComplete="email"
                inputMode="email"
                errorText={form.fieldErrors.email}
              />
              {apiError ? (
                <Button
                  testID="forgot-retry"
                  fullWidth
                  variant="secondary"
                  type="button"
                  disabled={loading}
                  onPress={onRetry}
                >
                  Try again
                </Button>
              ) : null}
              <Button
                testID="forgot-submit"
                fullWidth
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Send reset link
              </Button>
            </Stack>
          </form>
        ) : (
          <Button
            testID="forgot-send-another"
            fullWidth
            variant="secondary"
            type="button"
            onPress={onRetry}
          >
            Send another link
          </Button>
        )}
      </AuthCard>
    </AuthShell>
  );
};
