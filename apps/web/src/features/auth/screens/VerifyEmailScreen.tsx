import { useEffect, useState, type FC } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AuthCard,
  AuthShell,
  Button,
  InlineAlert,
  Stack,
  Text,
} from "@nexus/shared-ui";
import { getWebAuthClient } from "../../../api/auth/createWebAuthClient";
import { WEB_ROUTE_PATHS } from "../../../router/paths";
import { mapApiError } from "../hooks/useApiErrorMessage";

export const VerifyEmailScreen: FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [loading, setLoading] = useState(Boolean(token));
  const [apiError, setApiError] = useState<string>();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    const verify = async () => {
      try {
        await getWebAuthClient().verifyEmail({ token });
        setSuccess(true);
      } catch (error) {
        setApiError(mapApiError(error).message);
      } finally {
        setLoading(false);
      }
    };

    void verify();
  }, [token]);

  return (
    <AuthShell testID="verify-email-shell">
      <AuthCard
        title="Verify email"
        description="Confirming your email address."
      >
        <Stack gap="md">
          {loading ? <Text>Verifying…</Text> : null}
          {apiError ? (
            <InlineAlert tone="error" title="Verification failed">
              {apiError}
            </InlineAlert>
          ) : null}
          {success ? (
            <InlineAlert tone="success" title="Email verified">
              Your email has been verified.
            </InlineAlert>
          ) : null}
          <Link to={WEB_ROUTE_PATHS.login}>
            <Button fullWidth>Continue to sign in</Button>
          </Link>
        </Stack>
      </AuthCard>
    </AuthShell>
  );
};
