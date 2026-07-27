import { useState, type FC, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AuthCard,
  AuthShell,
  Button,
  FormField,
  InlineAlert,
  Stack,
} from "@nexus/shared-ui";
import { resetPasswordRequestSchema } from "@nexus/shared-validation";
import { getWebAuthClient } from "../../../api/auth/createWebAuthClient";
import { WEB_ROUTE_PATHS } from "../../../router/paths";
import { mapApiError } from "../hooks/useApiErrorMessage";
import { useAuthForm } from "../hooks/useAuthForm";

export const ResetPasswordScreen: FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const form = useAuthForm({
    schema: resetPasswordRequestSchema,
    initialValues: { token, password: "" },
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.validate()) {
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
    } catch (error) {
      setApiError(mapApiError(error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell testID="reset-password-shell">
      <AuthCard
        title="Reset password"
        description="Choose a new password for your account."
        status={
          apiError ? (
            <InlineAlert tone="error" title="Reset failed">
              {apiError}
            </InlineAlert>
          ) : success ? (
            <InlineAlert tone="success" title="Password updated">
              You can now sign in with your new password.
            </InlineAlert>
          ) : undefined
        }
      >
        <form onSubmit={onSubmit}>
          <Stack gap="md">
            <FormField
              label="New password"
              value={form.values.password}
              onChangeText={(value) => form.setField("password", value)}
              errorText={form.fieldErrors.password}
              required
              secureTextEntry
            />
            <Button fullWidth type="submit" loading={loading}>
              Reset password
            </Button>
            <Link to={WEB_ROUTE_PATHS.login}>Back to sign in</Link>
          </Stack>
        </form>
      </AuthCard>
    </AuthShell>
  );
};
