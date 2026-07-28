import { useCallback, useEffect, useState, type FC } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AuthCard,
  AuthFooter,
  AuthShell,
  Button,
  InlineAlert,
  Loader,
  Stack,
} from "@nexus/shared-ui";

import { getWebAuthClient } from "../../../api/auth/createWebAuthClient";
import { WEB_ROUTE_PATHS } from "../../../router/paths";
import { AuthBrand } from "../components/AuthBrand";
import { mapApiError } from "../hooks/useApiErrorMessage";
import type { MappedAuthError } from "../utils/authErrorPresentation";
import { focusAuthStatus } from "../utils/focusAuthFeedback";

type VerificationResult =
  | { success: true }
  | { success: false; error: MappedAuthError };

const requestEmailVerification = async (
  token: string
): Promise<VerificationResult> => {
  try {
    await getWebAuthClient().verifyEmail({ token });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: mapApiError(error),
    };
  }
};

export const VerifyEmailScreen: FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const missingToken = token.length === 0;

  const [loading, setLoading] = useState(!missingToken);
  const [apiError, setApiError] = useState<MappedAuthError | undefined>();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (missingToken) {
      return;
    }

    let cancelled = false;

    const runAutomaticVerification = async () => {
      const result = await requestEmailVerification(token);

      if (cancelled) {
        return;
      }

      if (result.success) {
        setSuccess(true);
        setApiError(undefined);
      } else {
        setSuccess(false);
        setApiError(result.error);
      }

      setLoading(false);
    };

    void runAutomaticVerification();

    return () => {
      cancelled = true;
    };
  }, [missingToken, token]);

  useEffect(() => {
    if (apiError || missingToken) {
      focusAuthStatus("verify");
    }
  }, [apiError, missingToken]);

  const retryVerification = useCallback(async () => {
    if (missingToken) {
      return;
    }

    setLoading(true);
    setApiError(undefined);
    setSuccess(false);

    const result = await requestEmailVerification(token);

    if (result.success) {
      setSuccess(true);
    } else {
      setApiError(result.error);
    }

    setLoading(false);
  }, [missingToken, token]);

  const invalidLink = missingToken || apiError?.kind === "invalidToken";
  const expiredLink = apiError?.kind === "expiredToken";

  return (
    <AuthShell testID="verify-email-shell" brand={<AuthBrand />}>
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
              href: WEB_ROUTE_PATHS.login,
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
              type="button"
              onPress={() => {
                void retryVerification();
              }}
            >
              Try again
            </Button>
          ) : null}

          {!loading && success ? (
            <Button
              testID="verify-continue"
              fullWidth
              type="button"
              onPress={() => {
                globalThis.location.assign(WEB_ROUTE_PATHS.login);
              }}
            >
              Continue to sign in
            </Button>
          ) : null}
        </Stack>
      </AuthCard>
    </AuthShell>
  );
};
