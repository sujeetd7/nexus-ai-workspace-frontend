import type { PropsWithChildren } from "react";
import {
  SharedUIProvider,
  THEME_PREFERENCE_STORAGE_KEY,
} from "@nexus/shared-ui";

import type { WebRuntime } from "../bootstrap/types";
import { ReduxProvider } from "./redux";

export interface AppProvidersProps extends PropsWithChildren {
  readonly runtime: WebRuntime;
}

/**
 * Web provider composition after successful bootstrap.
 * SharedUIProvider is the sole design-system provider; Redux wraps the store once.
 */
export function AppProviders({ children, runtime }: AppProvidersProps) {
  return (
    <SharedUIProvider
      defaultPreference="system"
      storage={runtime.themeStorage}
      storageKey={THEME_PREFERENCE_STORAGE_KEY}
    >
      <ReduxProvider store={runtime.store}>{children}</ReduxProvider>
    </SharedUIProvider>
  );
}
