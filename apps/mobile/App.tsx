/**
 * Sample React Native App — temporary template content until Batch 3.3 navigation.
 *
 * @format
 */

import { useCallback, useState, type ReactElement, Suspense } from "react";
import { NewAppScreen } from "@react-native/new-app-screen";
import { StatusBar, StyleSheet, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  bootstrapMobileApp,
  retryMobileBootstrap,
} from "./src/bootstrap/bootstrapApp";
import { StartupFailure, StartupLoading } from "./src/bootstrap/StartupViews";
import { ErrorBoundary } from "./src/components/ErrorBoundary";
import { AppProviders } from "./src/providers/AppProviders";

/**
 * Mobile composition root:
 * ErrorBoundary → Suspense → bootstrap gate → SafeArea → SharedUI → Redux
 */
function App(): ReactElement {
  const [outcome, setOutcome] = useState(() => bootstrapMobileApp());

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
          <AppContent />
        </AppProviders>
      </Suspense>
    </ErrorBoundary>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const isDarkMode = useColorScheme() === "dark";

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
