import type { PropsWithChildren } from "react";
import {
  SharedUIProvider,
  THEME_PREFERENCE_STORAGE_KEY,
} from "@nexus/shared-ui";

import { createLocalStorageAdapter } from "../platform/storage";
import { ReduxProvider } from "./redux";

const themeStorage = createLocalStorageAdapter();

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SharedUIProvider
      defaultPreference="system"
      storage={themeStorage}
      storageKey={THEME_PREFERENCE_STORAGE_KEY}
    >
      <ReduxProvider>{children}</ReduxProvider>
    </SharedUIProvider>
  );
}
