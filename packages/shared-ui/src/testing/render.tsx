import type { ReactElement, ReactNode } from "react";
import { render, type RenderResult } from "@testing-library/react";

import { SharedUIProvider } from "../providers/SharedUIProvider";

export function renderWithSharedUI(
  ui: ReactElement,
  options?: { preference?: "light" | "dark" | "system" },
): RenderResult {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <SharedUIProvider defaultPreference={options?.preference ?? "light"}>
        {children}
      </SharedUIProvider>
    );
  }

  return render(ui, { wrapper: Wrapper });
}
