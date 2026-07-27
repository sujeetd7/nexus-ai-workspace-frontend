import { useEffect, useState, type FC, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  AuthCard,
  AuthFooter,
  AuthShell,
  Button,
  FormField,
  InlineAlert,
  Stack,
} from "@nexus/shared-ui";
import { registerRequestSchema } from "@nexus/shared-validation";

import { getWebSession } from "../../../api/client/axios";
import { WEB_ROUTE_PATHS } from "../../../router/paths";
import { authSuccess } from "../../../store/slices/auth/authSlice";
import type { AppDispatch } from "../../../store/createAppStore";
import { mapApiError } from "../hooks/useApiErrorMessage";
import { useAuthForm } from "../hooks/useAuthForm";

export const RegisterScreen: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);
  const form = useAuthForm({
    schema: registerRequestSchema,
    initialValues: { email: "", password: "", firstName: "", lastName: "" },
  });

  useEffect(() => {
    if (success) {
      form.reset();
    }
  }, [success]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.validate()) {
      return;
    }

    setLoading(true);
    setApiError(undefined);

    try {
      const snapshot = await getWebSession().register({
        email: form.values.email,
        password: form.values.password,
        firstName: form.values.firstName || undefined,
        lastName: form.values.lastName || undefined,
      });

      if (snapshot.user && snapshot.accessToken && snapshot.refreshToken) {
        dispatch(
          authSuccess({
            user: snapshot.user,
            tokens: {
              accessToken: snapshot.accessToken,
              refreshToken: snapshot.refreshToken,
            },
          }),
        );
        setSuccess(true);
      }
    } catch (error) {
      setApiError(mapApiError(error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell testID="register-shell">
      <AuthCard
        title="Create account"
        description="Register to access Nexus AI Workspace."
        status={
          apiError ? (
            <InlineAlert tone="error" title="Unable to register">
              {apiError}
            </InlineAlert>
          ) : success ? (
            <InlineAlert tone="success" title="Account created">
              Check your email if verification is required.
            </InlineAlert>
          ) : undefined
        }
        footer={
          <AuthFooter
            prompt="Already have an account?"
            link={{ label: "Sign in", href: WEB_ROUTE_PATHS.login }}
          />
        }
      >
        <form onSubmit={onSubmit}>
          <Stack gap="md">
            <FormField label="Email" value={form.values.email} onChangeText={(value) => form.setField("email", value)} errorText={form.fieldErrors.email} required inputMode="email" />
            <FormField label="Password" value={form.values.password} onChangeText={(value) => form.setField("password", value)} errorText={form.fieldErrors.password} required secureTextEntry />
            <Button fullWidth type="submit" loading={loading}>
              Register
            </Button>
            <Link to={WEB_ROUTE_PATHS.login}>Back to sign in</Link>
          </Stack>
        </form>
      </AuthCard>
    </AuthShell>
  );
};
