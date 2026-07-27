import { useEffect, type FC, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  AuthCard,
  AuthFooter,
  AuthShell,
  Button,
  FormField,
  InlineAlert,
  Stack,
  Text,
} from "@nexus/shared-ui";
import { loginRequestSchema } from "@nexus/shared-validation";

import { WEB_ROUTE_PATHS } from "../../../router/paths";
import { clearAuthError } from "../../../store/slices/auth/authSlice";
import {
  selectAuthError,
  selectAuthLoading,
} from "../../../store/slices/auth/selectors";
import { createLoginAction } from "../../../store/sagas/auth/authSaga";
import type { AppDispatch } from "../../../store/createAppStore";
import { useAuthForm } from "../hooks/useAuthForm";

export const LoginScreen: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAuthLoading);
  const apiError = useSelector(selectAuthError);
  const form = useAuthForm({
    schema: loginRequestSchema,
    initialValues: { email: "", password: "" },
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.validate()) {
      return;
    }

    dispatch(
      createLoginAction({
        email: form.values.email,
        password: form.values.password,
      }),
    );
  };

  return (
    <AuthShell
      testID="login-shell"
      brand={
        <Text variant="h2" align="center" weight="bold">
          Nexus
        </Text>
      }
    >
      <AuthCard
        testID="login-card"
        title="Sign in"
        description="Enter your email and password to continue."
        status={
          apiError ? (
            <InlineAlert tone="error" title="Unable to sign in" testID="login-api-error">
              {apiError}
            </InlineAlert>
          ) : undefined
        }
        footer={
          <AuthFooter
            prompt="Don't have an account?"
            link={{ label: "Sign up", href: WEB_ROUTE_PATHS.register }}
          />
        }
      >
        <form onSubmit={onSubmit}>
          <Stack gap="md">
            <FormField
              testID="login-email"
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
            <FormField
              testID="login-password"
              label="Password"
              placeholder="Enter your password"
              value={form.values.password}
              onChangeText={(value) => form.setField("password", value)}
              disabled={loading}
              required
              secureTextEntry
              autoComplete="current-password"
              errorText={form.fieldErrors.password}
            />
            <Link to={WEB_ROUTE_PATHS.forgotPassword}>Forgot password?</Link>
            <Button
              testID="login-submit"
              fullWidth
              type="submit"
              loading={loading}
              disabled={loading}
            >
              Sign in
            </Button>
          </Stack>
        </form>
      </AuthCard>
    </AuthShell>
  );
};
