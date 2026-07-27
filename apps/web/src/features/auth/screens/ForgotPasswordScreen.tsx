import { useState, type FC, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  AuthCard,
  AuthShell,
  Button,
  FormField,
  InlineAlert,
  Stack,
} from "@nexus/shared-ui";
import { forgotPasswordRequestSchema } from "@nexus/shared-validation";

import { getWebAuthClient } from "../../../api/auth/createWebAuthClient";
import { WEB_ROUTE_PATHS } from "../../../router/paths";
import { mapApiError } from "../hooks/useApiErrorMessage";
import { useAuthForm } from "../hooks/useAuthForm";

export const ForgotPasswordScreen: FC = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const form = useAuthForm({
    schema: forgotPasswordRequestSchema,
    initialValues: { email: "" },
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.validate()) {
      return;
    }

    setLoading(true);
    setApiError(undefined);

    try {
      await getWebAuthClient().forgotPassword({ email: form.values.email });
      setSuccess(true);
      form.reset();
    } catch (error) {
      setApiError(mapApiError(error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell testID="forgot-password-shell">
      <AuthCard
        title="Forgot password"
        description="We'll email reset instructions if the account exists."
        status={
          apiError ? (
            <InlineAlert tone="error" title="Request failed">
              {apiError}
            </InlineAlert>
          ) : success ? (
            <InlineAlert tone="success" title="Check your email">
              If an account exists, reset instructions were sent.
            </InlineAlert>
          ) : undefined
        }
      >
        <form onSubmit={onSubmit}>
          <Stack gap="md">
            <FormField
              label="Email"
              value={form.values.email}
              onChangeText={(value) => form.setField("email", value)}
              errorText={form.fieldErrors.email}
              required
              inputMode="email"
            />
            <Button fullWidth type="submit" loading={loading}>
              Send reset link
            </Button>
            <Link to={WEB_ROUTE_PATHS.login}>Back to sign in</Link>
          </Stack>
        </form>
      </AuthCard>
    </AuthShell>
  );
};
