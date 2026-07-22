import {
  useCallback,
  useState,
  type ReactElement,
} from "react";
import { Suspense } from "react";

import { ErrorBoundary } from "../components/common/ErrorBoundary";
import { Loading } from "../pages/Loading";
import { AppProviders } from "../providers/AppProviders";
import { AppRouter } from "../router/AppRouter";
import {
  bootstrapWebApp,
  retryWebBootstrap,
} from "./bootstrapApp";
import { StartupFailure, StartupLoading } from "./StartupViews";
import type { WebBootstrapOutcome } from "./types";

/**
 * Web composition root:
 * ErrorBoundary → Suspense → bootstrap gate → SharedUI → Redux → Router
 *
 * Bootstrap runs synchronously via state initializer (idempotent) to avoid
 * effect-driven cascading renders.
 */
export function Bootstrap(): ReactElement {
  const [outcome, setOutcome] = useState<WebBootstrapOutcome>(() =>
    bootstrapWebApp(),
  );

  const handleRetry = useCallback(() => {
    setOutcome(retryWebBootstrap());
  }, []);

  if (outcome.status === "failed") {
    return (
      <ErrorBoundary>
        <Suspense fallback={<StartupLoading />}>
          <StartupFailure
            failure={outcome.failure}
            onRetry={outcome.failure.retryable ? handleRetry : undefined}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary logger={outcome.runtime.logger}>
      <Suspense fallback={<Loading />}>
        <AppProviders runtime={outcome.runtime}>
          <AppRouter />
        </AppProviders>
      </Suspense>
    </ErrorBoundary>
  );
}
