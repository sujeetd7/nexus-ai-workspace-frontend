import type { PropsWithChildren } from "react";

import { ThemeProvider } from "@nexus/shared-ui";
import { ReduxProvider } from "./redux";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <ReduxProvider>{children}</ReduxProvider>
    </ThemeProvider>
  );
}
