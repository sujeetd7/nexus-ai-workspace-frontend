import { useEffect, type FC } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import {
  AuthCard,
  AuthFooter,
  Button,
  FormField,
  InlineAlert,
  Link,
  Stack,
} from "@nexus/shared-ui";
import { loginRequestSchema } from "@nexus/shared-validation";

import { getMobileSession } from "../../api/client/axios";
import type { RootStackParamList } from "../../navigation/types";
import { MOBILE_ROUTE_NAMES } from "../../navigation/types";
import {
  authFailure,
  authSuccess,
  clearAuthError,
  loginRequest,
} from "../../store/slices/auth/authSlice";
import {
  selectAuthError,
  selectAuthLoading,
} from "../../store/slices/auth/selectors";
import type { AppDispatch } from "../../store/createAppStore";
import { AuthBrand } from "./components/AuthBrand";
import { AuthScreenLayout } from "./components/AuthScreenLayout";
import { useAuthForm } from "./hooks/useAuthForm";
import { mapApiError } from "./hooks/useApiErrorMessage";
import {
  announceAuthFeedback,
  announceFirstFieldError,
} from "./utils/announceAuthFeedback";
import {
  classifyAuthError,
  loginErrorTitle,
} from "./utils/authErrorPresentation";

type LoginNav = NativeStackNavigationProp<RootStackParamList, "Login">;

export const LoginScreen: FC = () => {
  const navigation = useNavigation<LoginNav>();
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
    if (classified) {
      announceAuthFeedback(`${loginErrorTitle(classified.kind)}. ${classified.message}`);
    }
  }, [classified]);

  const onSubmit = async () => {
    const result = form.validate();
    if (!result.ok) {
      announceFirstFieldError(
        result.errors as Partial<Record<string, string>>,
        ["email", "password"],
      );
      return;
    }

    dispatch(loginRequest());
    try {
      const snapshot = await getMobileSession().login(
        form.values.email,
        form.values.password,
      );
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
      }
    } catch (error) {
      const mapped = mapApiError(error);
      dispatch(authFailure(mapped.message));
    }
  };

  return (
    <AuthScreenLayout testID="mobile-login-shell" brand={<AuthBrand />}>
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
            link={{
              label: "Sign up",
              href: "register",
              accessibilityLabel: "Sign up",
              onPress: () => {
                navigation.navigate(MOBILE_ROUTE_NAMES.Register);
              },
            }}
          />
        }
      >
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
            <Link
              href="forgot-password"
              accessibilityLabel="Forgot password"
              onPress={() => {
                navigation.navigate(MOBILE_ROUTE_NAMES.ForgotPassword);
              }}
            >
              Forgot password?
            </Link>
          </Stack>
          <Button
            testID="login-submit"
            fullWidth
            loading={loading}
            disabled={loading}
            onPress={() => {
              void onSubmit();
            }}
            accessibilityLabel="Sign in"
            accessibilityHint="Submits your email and password"
          >
            Sign in
          </Button>
        </Stack>
      </AuthCard>
    </AuthScreenLayout>
  );
};
