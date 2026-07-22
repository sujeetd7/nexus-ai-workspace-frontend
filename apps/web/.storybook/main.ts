import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
// @ts-expect-error Tamagui vite-plugin types under module nodenext
import { tamaguiAliases, tamaguiPlugin } from "@tamagui/vite-plugin";

/**
 * Web-only Design System Storybook for `@nexus/shared-ui`.
 * Mirrors `apps/web/vite.config.ts` resolve rules (RNW + `.web.tsx`).
 */
const config: StorybookConfig = {
  stories: ["../src/stories/**/*.mdx", "../src/stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [
        tamaguiPlugin({
          config: "../../packages/shared-ui/src/tamagui/config.ts",
          components: ["@tamagui/core"],
          disableExtraction: true,
        }),
      ],
      resolve: {
        alias: [
          { find: "react-native", replacement: "react-native-web" },
          ...tamaguiAliases({ rnwLite: true }),
        ],
        extensions: [
          ".web.tsx",
          ".web.ts",
          ".tsx",
          ".ts",
          ".web.jsx",
          ".web.js",
          ".jsx",
          ".js",
          ".json",
        ],
      },
    });
  },
};

export default config;
