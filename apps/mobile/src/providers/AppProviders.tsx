import type { PropsWithChildren } from "react";

import { SharedUIProvider } from "@nexus/shared-ui";

export function AppProviders({ children }: PropsWithChildren) {
  return <SharedUIProvider>{children}</SharedUIProvider>;
}
