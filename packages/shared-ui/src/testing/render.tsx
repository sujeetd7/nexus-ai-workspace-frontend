import type { ReactElement, ReactNode } from "react";
import { render, type RenderResult } from "@testing-library/react";

import { SharedUIProvider } from "../providers/SharedUIProvider";
import type { ThemePreference } from "../theme/resolveThemeMode";

export type RenderWithSharedUIOptions = {
  preference?: ThemePreference;
};

export function renderWithSharedUI(
  ui: ReactElement,
  options?: RenderWithSharedUIOptions,
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

/**
 * Rerender helper that remounts under a different theme preference.
 * Prefer for theme verification without Storybook.
 */
export function renderWithThemePreference(
  ui: ReactElement,
  preference: ThemePreference,
): RenderResult {
  return renderWithSharedUI(ui, { preference });
}
