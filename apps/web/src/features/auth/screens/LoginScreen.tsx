import { useEffect, type FC, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AuthCard,
  AuthFooter,
  AuthShell,
  Button,
  FormField,
  InlineAlert,
  Link,
  Stack,
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
import { AuthBrand } from "../components/AuthBrand";
import { useAuthForm } from "../hooks/useAuthForm";
import {
  classifyAuthError,
  loginErrorTitle,
} from "../utils/authErrorPresentation";
import {
  focusAuthStatus,
  focusFirstFieldError,
} from "../utils/focusAuthFeedback";

export const LoginScreen: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAuthLoading);
  const apiError = useSelector(selectAuthError);
  const form = useAuthForm({
    schema: loginRequestSchema,
    initialValues: { email: "", password: "" },
  });

  const classified = apiError
    ? classifyAuthError({
        message: apiError,
        retryable: false,
      })
    : undefined;

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (apiError) {
      focusAuthStatus("login");
    }
  }, [apiError]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const result = form.validate();
    if (!result.ok) {
      focusFirstFieldError(
        result.errors as Partial<Record<string, string>>,
        ["email", "password"],
        "login",
      );
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
    <AuthShell testID="login-shell" brand={<AuthBrand />}>
      <AuthCard
        testID="login-card"
        title="Sign in"
        description="Enter your email and password to continue."
        headingLevel={2}
        status={
          classified ? (
            <InlineAlert
              tone="error"
              title={loginErrorTitle(classified.kind)}
              testID="login-api-error"
            >
              {classified.message}
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
        <form onSubmit={onSubmit} noValidate>
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
            <Stack direction="horizontal" justify="end">
              <Link href={WEB_ROUTE_PATHS.forgotPassword}>Forgot password?</Link>
            </Stack>
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
