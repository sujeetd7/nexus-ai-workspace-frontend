import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";

import { ThemeProvider } from "@nexus/shared-ui";
import { store } from "../store";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}
