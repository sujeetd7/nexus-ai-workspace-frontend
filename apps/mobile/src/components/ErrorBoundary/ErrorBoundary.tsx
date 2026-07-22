import { Component, type ErrorInfo, type ReactNode } from "react";
import type { Logger } from "@nexus/shared-types";
import { logAppError } from "@nexus/shared-utils";
import { Button, SharedUIProvider, Stack, Text } from "@nexus/shared-ui";

import { mobileLogger } from "../../platform/logging";

interface Props {
  children: ReactNode;
  logger?: Logger;
}

interface State {
  hasError: boolean;
}

/**
 * Application-owned ErrorBoundary for React Native.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, _info: ErrorInfo) {
    const logger = this.props.logger ?? mobileLogger;
    logAppError(logger, error, "Unhandled UI rendering error.");
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  override render() {
    if (this.state.hasError) {
      return (
        <SharedUIProvider defaultPreference="system">
          <Stack
            padding="xl"
            align="center"
            justify="center"
            gap="md"
            accessibilityRole="alert"
            accessibilityLabel="Something went wrong."
          >
            <Text>Something went wrong.</Text>
            <Button onPress={this.handleRetry}>Retry</Button>
          </Stack>
        </SharedUIProvider>
      );
    }

    return this.props.children;
  }
}
