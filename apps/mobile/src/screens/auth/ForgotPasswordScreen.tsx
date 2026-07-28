import { useEffect, useState, type FC } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  AuthCard,
  AuthFooter,
  Button,
  FormField,
  InlineAlert,
  Stack,
} from "@nexus/shared-ui";
import { forgotPasswordRequestSchema } from "@nexus/shared-validation";

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

type ForgotNav = NativeStackNavigationProp<
  RootStackParamList,
  "ForgotPassword"
>;

export const ForgotPasswordScreen: FC = () => {
  const navigation = useNavigation<ForgotNav>();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<MappedAuthError | undefined>();
  const [success, setSuccess] = useState(false);
  const form = useAuthForm({
    schema: forgotPasswordRequestSchema,
    initialValues: { email: "" },
  });

  useEffect(() => {
    if (apiError) {
      announceAuthFeedback(`${apiError.title}. ${apiError.message}`);
    }
  }, [apiError]);

  const onSubmit = async () => {
    const result = form.validate();
    if (!result.ok) {
      announceFirstFieldError(
        result.errors as Partial<Record<string, string>>,
        ["email"],
      );
      return;
    }

    setLoading(true);
    setApiError(undefined);

    try {
      await getMobileAuthClient().forgotPassword({ email: form.values.email });
      setSuccess(true);
      form.reset();
      announceAuthFeedback("Check your email for reset instructions");
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
    <AuthScreenLayout testID="mobile-forgot-password-shell" brand={<AuthBrand />}>
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
            link={{
              label: "Back to sign in",
              href: "login",
              accessibilityLabel: "Back to sign in",
              onPress: () => {
                navigation.navigate(MOBILE_ROUTE_NAMES.Login);
              },
            }}
          />
        }
      >
        {!success ? (
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
                disabled={loading}
                onPress={onRetry}
                accessibilityLabel="Try again"
              >
                Try again
              </Button>
            ) : null}
            <Button
              testID="forgot-submit"
              fullWidth
              loading={loading}
              disabled={loading}
              onPress={() => {
                void onSubmit();
              }}
              accessibilityLabel="Send reset link"
            >
              Send reset link
            </Button>
          </Stack>
        ) : (
          <Button
            testID="forgot-send-another"
            fullWidth
            variant="secondary"
            onPress={onRetry}
            accessibilityLabel="Send another link"
          >
            Send another link
          </Button>
        )}
      </AuthCard>
    </AuthScreenLayout>
  );
};
