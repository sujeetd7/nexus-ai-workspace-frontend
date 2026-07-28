import { useCallback, useEffect, useState, type FC } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  AuthCard,
  AuthFooter,
  Button,
  InlineAlert,
  Loader,
  Stack,
} from "@nexus/shared-ui";

import { getMobileAuthClient } from "../../api/auth/createMobileAuthClient";
import type { RootStackParamList } from "../../navigation/types";
import { MOBILE_ROUTE_NAMES } from "../../navigation/types";
import { AuthBrand } from "./components/AuthBrand";
import { AuthScreenLayout } from "./components/AuthScreenLayout";
import { mapApiError } from "./hooks/useApiErrorMessage";
import type { MappedAuthError } from "./utils/authErrorPresentation";
import { announceAuthFeedback } from "./utils/announceAuthFeedback";

type VerifyRoute = NativeStackScreenProps<
  RootStackParamList,
  "VerifyEmail"
>["route"];
type VerifyNav = NativeStackNavigationProp<RootStackParamList, "VerifyEmail">;

export const VerifyEmailScreen: FC = () => {
  const navigation = useNavigation<VerifyNav>();
  const route = useRoute<VerifyRoute>();
  const token = route.params?.token ?? "";
  const missingToken = token.length === 0;
  const [loading, setLoading] = useState(!missingToken);
  const [apiError, setApiError] = useState<MappedAuthError | undefined>();
  const [success, setSuccess] = useState(false);

  const verify = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setApiError(undefined);
    setSuccess(false);

    try {
      await getMobileAuthClient().verifyEmail({ token });
      setSuccess(true);
      announceAuthFeedback("Email verified");
    } catch (error) {
      setApiError(mapApiError(error));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void verify();
  }, [verify]);

  useEffect(() => {
    if (missingToken) {
      announceAuthFeedback("Invalid verification link");
    } else if (apiError) {
      announceAuthFeedback(`${apiError.title}. ${apiError.message}`);
    }
  }, [apiError, missingToken]);

  const invalidLink = missingToken || apiError?.kind === "invalidToken";
  const expiredLink = apiError?.kind === "expiredToken";

  return (
    <AuthScreenLayout testID="mobile-verify-email-shell" brand={<AuthBrand />}>
      <AuthCard
        testID="verify-card"
        title="Verify email"
        description={
          loading
            ? "Confirming your email address."
            : success
              ? "Your email is confirmed."
              : "We could not verify this email link."
        }
        headingLevel={2}
        status={
          loading ? (
            <Stack align="center" gap="sm">
              <Loader
                testID="verify-loading"
                accessibilityLabel="Verifying email"
              />
            </Stack>
          ) : missingToken ? (
            <InlineAlert
              tone="error"
              title="Invalid link"
              testID="verify-invalid-token"
            >
              This verification link is missing a token. Request a new email.
            </InlineAlert>
          ) : expiredLink ? (
            <InlineAlert
              tone="warning"
              title="Link expired"
              testID="verify-expired-token"
            >
              {apiError?.message ??
                "This verification link has expired. Request a new email."}
            </InlineAlert>
          ) : invalidLink ? (
            <InlineAlert
              tone="error"
              title="Invalid link"
              testID="verify-invalid-token"
            >
              {apiError?.message ??
                "This verification link is invalid. Request a new email."}
            </InlineAlert>
          ) : apiError ? (
            <InlineAlert
              tone="error"
              title={
                apiError.kind === "network"
                  ? "Connection problem"
                  : "Verification failed"
              }
              testID="verify-api-error"
            >
              {apiError.message}
            </InlineAlert>
          ) : success ? (
            <InlineAlert
              tone="success"
              title="Email verified"
              testID="verify-success"
            >
              Your email has been verified.
            </InlineAlert>
          ) : undefined
        }
        footer={
          <AuthFooter
            link={{
              label: success ? "Continue to sign in" : "Back to sign in",
              href: "login",
              accessibilityLabel: success
                ? "Continue to sign in"
                : "Back to sign in",
              onPress: () => {
                navigation.navigate(MOBILE_ROUTE_NAMES.Login);
              },
            }}
          />
        }
      >
        <Stack gap="md">
          {!loading && !success && token ? (
            <Button
              testID="verify-retry"
              fullWidth
              variant={apiError?.retryable ? "primary" : "secondary"}
              onPress={() => {
                void verify();
              }}
              accessibilityLabel="Try again"
            >
              Try again
            </Button>
          ) : null}
          {!loading && success ? (
            <Button
              testID="verify-continue"
              fullWidth
              onPress={() => {
                navigation.navigate(MOBILE_ROUTE_NAMES.Login);
              }}
              accessibilityLabel="Continue to sign in"
            >
              Continue to sign in
            </Button>
          ) : null}
        </Stack>
      </AuthCard>
    </AuthScreenLayout>
  );
};
