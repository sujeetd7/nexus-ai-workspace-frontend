import type { PropsWithChildren } from "react";

import { SharedUIProvider } from "@nexus/shared-ui";

/**
 * Mobile UI providers. Durable theme persistence awaits a native StorageAdapter (TD-032).
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SharedUIProvider defaultPreference="system">{children}</SharedUIProvider>
  );
}
