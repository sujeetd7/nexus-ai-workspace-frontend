import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { SharedUIProvider } from "@nexus/shared-ui";
import { SafeAreaProvider } from "react-native-safe-area-context";

import type { MobileRuntime } from "../bootstrap/types";

export interface AppProvidersProps extends PropsWithChildren {
  readonly runtime: MobileRuntime;
}

/**
 * Mobile provider composition after successful bootstrap.
 * SafeArea remains application-owned and outermost of the design-system stack.
 * Theme persistence deferred (TD-032 / TD-051).
 */
export function AppProviders({ children, runtime }: AppProvidersProps) {
  return (
    <SafeAreaProvider>
      <SharedUIProvider defaultPreference="system">
        <Provider store={runtime.store}>{children}</Provider>
      </SharedUIProvider>
    </SafeAreaProvider>
  );
}
