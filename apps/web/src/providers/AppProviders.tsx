import type { PropsWithChildren } from "react";
import { SharedUIProvider } from "@nexus/shared-ui";
import { createNamespacedStorageKey } from "@nexus/shared-utils";

import { createLocalStorageAdapter } from "../platform/storage";
import { ReduxProvider } from "./redux";

const themeStorage = createLocalStorageAdapter();
const themeStorageKey = createNamespacedStorageKey("prefs", "theme");

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SharedUIProvider
      defaultPreference="system"
      storage={themeStorage}
      storageKey={themeStorageKey}
    >
      <ReduxProvider>{children}</ReduxProvider>
    </SharedUIProvider>
  );
}
