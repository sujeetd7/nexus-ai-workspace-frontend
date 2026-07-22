/**
 * Shared ESLint import-boundary configs for the Nexus monorepo.
 * Consumed by the root eslint.config.mjs and apps/web/eslint.config.js.
 */

/**
 * Forbid deep `@nexus/<pkg>/...` imports while allowing approved package.json
 * export subpaths (`tamagui-config`, `testing`).
 */
const deepNexusImportPattern = {
  regex:
    "^@nexus/(?!shared-ui/(?:tamagui-config|testing)$)[^/]+/.+",
  message:
    "Import only the package public API: @nexus/<package-name>. Deep imports are forbidden. Approved shared-ui subpaths: tamagui-config, testing.",
};

/** @type {import("eslint").Linter.RulesRecord} */
const deepPackageImports = {
  "no-restricted-imports": [
    "error",
    {
      patterns: [deepNexusImportPattern],
    },
  ],
};

/** @type {import("eslint").Linter.Config[]} */
export const packageBoundaryConfigs = [
  {
    files: ["packages/**/*.{js,cjs,mjs,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "axios",
              message:
                "Axios is only allowed in @nexus/shared-network (and platform api adapters in apps).",
            },
          ],
          patterns: [
            deepNexusImportPattern,
            {
              group: [
                "apps/**",
                "**/apps/**",
                "web",
                "mobile",
                "*/apps/**",
                "../apps/**",
                "../../apps/**",
              ],
              message: "Packages must not import from apps.",
            },
          ],
        },
      ],
    },
  },
  {
    // Networking package may use Axios; still cannot import apps or deep package paths.
    files: ["packages/shared-network/**/*.{js,cjs,mjs,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            deepNexusImportPattern,
            {
              group: [
                "apps/**",
                "**/apps/**",
                "web",
                "mobile",
                "*/apps/**",
                "../apps/**",
                "../../apps/**",
              ],
              message: "Packages must not import from apps.",
            },
          ],
        },
      ],
    },
  },
  {
    // Non-network shared packages must not depend on networking.
    files: [
      "packages/shared-ui/**/*.{js,cjs,mjs,ts,tsx}",
      "packages/shared-utils/**/*.{js,cjs,mjs,ts,tsx}",
      "packages/shared-types/**/*.{js,cjs,mjs,ts,tsx}",
      "packages/shared-validation/**/*.{js,cjs,mjs,ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "axios",
              message: "Axios is only allowed in @nexus/shared-network.",
            },
            {
              name: "@nexus/shared-network",
              message:
                "Non-network shared packages must not depend on @nexus/shared-network.",
            },
          ],
          patterns: [
            deepNexusImportPattern,
            {
              group: [
                "apps/**",
                "**/apps/**",
                "web",
                "mobile",
                "*/apps/**",
                "../apps/**",
                "../../apps/**",
              ],
              message: "Packages must not import from apps.",
            },
          ],
        },
      ],
    },
  },
];

/** @type {import("eslint").Linter.Config[]} */
export const webBoundaryConfigs = [
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      ...deepPackageImports,
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "axios",
              message:
                "Axios is confined to apps/web/src/api (platform adapters) and @nexus/shared-network.",
            },
            {
              name: "@tamagui/core",
              importNames: ["TamaguiProvider"],
              message:
                "Use SharedUIProvider from @nexus/shared-ui. Applications must not instantiate TamaguiProvider.",
            },
            {
              name: "tamagui",
              importNames: ["TamaguiProvider"],
              message:
                "Use SharedUIProvider from @nexus/shared-ui. Applications must not instantiate TamaguiProvider.",
            },
          ],
          patterns: [
            deepNexusImportPattern,
            {
              group: [
                "mobile",
                "apps/mobile",
                "apps/mobile/**",
                "**/apps/mobile/**",
              ],
              message: "Web must not import from the mobile app.",
            },
            {
              group: ["**/features/**", "*/features/**"],
              message:
                "Do not import features by filesystem path. Keep cross-feature access behind shared app layers (api/store/components).",
            },
          ],
        },
      ],
    },
  },
  {
    // Platform networking adapters may import Axios types/runtime as needed.
    files: ["src/api/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            deepNexusImportPattern,
            {
              group: [
                "mobile",
                "apps/mobile",
                "apps/mobile/**",
                "**/apps/mobile/**",
              ],
              message: "Web must not import from the mobile app.",
            },
            {
              group: ["**/features/**", "*/features/**"],
              message:
                "Networking adapters must not import feature modules.",
            },
          ],
        },
      ],
    },
  },
];
