/**
 * Mobile application composition root.
 *
 * @format
 */

import { useCallback, useState, type ReactElement, Suspense } from "react";
import { StatusBar, useColorScheme } from "react-native";

import {
  bootstrapMobileApp,
  retryMobileBootstrap,
} from "./src/bootstrap/bootstrapApp";
import { StartupFailure, StartupLoading } from "./src/bootstrap/StartupViews";
import { ErrorBoundary } from "./src/components/ErrorBoundary";
import { AppNavigation } from "./src/navigation";
import { AppProviders } from "./src/providers/AppProviders";

/**
 * Mobile composition root:
 * ErrorBoundary → Suspense → bootstrap gate → SafeArea → SharedUI → Redux → Navigation
 */
function App(): ReactElement {
  const [outcome, setOutcome] = useState(() => bootstrapMobileApp());
  const isDarkMode = useColorScheme() === "dark";

  const handleRetry = useCallback(() => {
    setOutcome(retryMobileBootstrap());
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
      <Suspense fallback={<StartupLoading />}>
        <AppProviders runtime={outcome.runtime}>
          <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
          <AppNavigation />
        </AppProviders>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
