import { Component, type ErrorInfo, type ReactNode } from "react";
import type { Logger } from "@nexus/shared-types";
import { logAppError } from "@nexus/shared-utils";

import { webLogger } from "../../../platform/logging";

interface Props {
  children: ReactNode;
  /** Optional logger injection for tests. Defaults to the Web platform logger. */
  logger?: Logger;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    // Intentionally ignore React ErrorInfo (component stack is forbidden).
    void info;
    const logger = this.props.logger ?? webLogger;
    logAppError(logger, error, "Unhandled UI rendering error.");
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 32,
            textAlign: "center",
          }}
        >
          <h2>Something went wrong.</h2>
        </div>
      );
    }

    return this.props.children;
  }
}
