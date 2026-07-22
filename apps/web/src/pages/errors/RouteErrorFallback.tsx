import { useCallback, useEffect, useRef } from "react";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import { Button, Stack, Text } from "@nexus/shared-ui";
import { logAppError } from "@nexus/shared-utils";

import { webLogger } from "../../platform/logging";

/**
 * React Router route error fallback.
 * Distinct from NotFound (unknown path) and root ErrorBoundary.
 */
export function RouteErrorFallback() {
  const error = useRouteError();
  const navigate = useNavigate();
  const loggedRef = useRef(false);

  useEffect(() => {
    if (loggedRef.current) {
      return;
    }
    loggedRef.current = true;

    if (error instanceof Error) {
      logAppError(webLogger, error, "Unhandled route rendering error.");
      return;
    }

    if (isRouteErrorResponse(error)) {
      webLogger.error("Route error response.", {
        status: error.status,
        statusText: error.statusText,
      });
      return;
    }

    webLogger.error("Unknown route error.", { error: String(error) });
  }, [error]);

  const handleReturnHome = useCallback(() => {
    void navigate("/", { replace: true });
  }, [navigate]);

  return (
    <Stack
      padding="xl"
      align="center"
      gap="md"
      accessibilityRole="alert"
      accessibilityLabel="Page error"
      testID="route-error"
    >
      <Text variant="h2" accessibilityRole="heading">
        Something went wrong
      </Text>
      <Text color="textSecondary">
        This page could not be displayed. You can return to the home page.
      </Text>
      <Button onPress={handleReturnHome} accessibilityLabel="Return to home">
        Return home
      </Button>
    </Stack>
  );
}
