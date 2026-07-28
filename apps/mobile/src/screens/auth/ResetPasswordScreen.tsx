import { useEffect, useMemo, useState, type FC } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  AuthCard,
  AuthFooter,
  Button,
  FormField,
  InlineAlert,
  Stack,
} from "@nexus/shared-ui";
import { resetPasswordRequestSchema } from "@nexus/shared-validation";

import { getMobileAuthClient } from "../../api/auth/createMobileAuthClient";
import type { RootStackParamList } from "../../navigation/types";
import { MOBILE_ROUTE_NAMES } from "../../navigation/types";
import { AuthBrand } from "./components/AuthBrand";
import { AuthScreenLayout } from "./components/AuthScreenLayout";
import { mapApiError } from "./hooks/useApiErrorMessage";
import { useAuthForm } from "./hooks/useAuthForm";
import type { MappedAuthError } from "./utils/authErrorPresentation";
import {
  announceAuthFeedback,
  announceFirstFieldError,
} from "./utils/announceAuthFeedback";

type ResetRoute = NativeStackScreenProps<
  RootStackParamList,
  "ResetPassword"
>["route"];
type ResetNav = NativeStackNavigationProp<RootStackParamList, "ResetPassword">;

export const ResetPasswordScreen: FC = () => {
  const navigation = useNavigation<ResetNav>();
  const route = useRoute<ResetRoute>();
  const token = route.params?.token ?? "";
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
      announceAuthFeedback(`${apiError.title}. ${apiError.message}`);
    }
    if (tokenBlocked === "invalidToken") {
      announceAuthFeedback("Invalid password reset link");
    }
    if (tokenBlocked === "expiredToken") {
      announceAuthFeedback("Password reset link expired");
    }
  }, [apiError, tokenBlocked]);

  const onSubmit = async () => {
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
      announceFirstFieldError(
        {
          ...(result.errors as Partial<Record<string, string>>),
          confirmPassword: nextConfirmError,
        },
        ["password", "confirmPassword"],
      );
      return;
    }

    setLoading(true);
    setApiError(undefined);

    try {
      await getMobileAuthClient().resetPassword({
        token: form.values.token,
        password: form.values.password,
      });
      setSuccess(true);
      form.reset();
      setConfirmPassword("");
      announceAuthFeedback("Password updated");
    } catch (error) {
      setApiError(mapApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout testID="mobile-reset-password-shell" brand={<AuthBrand />}>
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
              href: tokenBlocked ? "forgot-password" : "login",
              accessibilityLabel: tokenBlocked
                ? "Request a new link"
                : "Back to sign in",
              onPress: () => {
                navigation.navigate(
                  tokenBlocked
                    ? MOBILE_ROUTE_NAMES.ForgotPassword
                    : MOBILE_ROUTE_NAMES.Login,
                );
              },
            }}
          />
        }
      >
        {!tokenBlocked && !success ? (
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
                disabled={loading}
                onPress={() => setApiError(undefined)}
                accessibilityLabel="Try again"
              >
                Try again
              </Button>
            ) : null}
            <Button
              testID="reset-submit"
              fullWidth
              loading={loading}
              disabled={loading}
              onPress={() => {
                void onSubmit();
              }}
              accessibilityLabel="Update password"
            >
              Update password
            </Button>
          </Stack>
        ) : null}
      </AuthCard>
    </AuthScreenLayout>
  );
};
