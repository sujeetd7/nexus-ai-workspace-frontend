import type { Preview } from "@storybook/react";
import React from "react";

import { SharedUIProvider, type ThemePreference } from "@nexus/shared-ui";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "padded",
    a11y: {
      // Lightweight checks in panel; do not fail CI on warnings in Batch 2.6.
      test: "todo",
    },
  },
  globalTypes: {
    theme: {
      description: "Nexus theme preference",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
          { value: "system", title: "System" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (Story, context) => {
      const preference = (context.globals.theme ??
        "light") as ThemePreference;
      return (
        <SharedUIProvider preference={preference}>
          <div
            style={{
              minHeight: "100%",
              padding: 16,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            <Story />
          </div>
        </SharedUIProvider>
      );
    },
  ],
};

export default preview;
