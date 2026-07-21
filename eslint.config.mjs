import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

import { packageBoundaryConfigs } from "./configs/eslint/boundaries.mjs";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/.turbo/**",
      "apps/mobile/android/**",
      "apps/mobile/ios/**",
      "tmp/**",
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["**/*.{js,cjs,mjs,ts,tsx}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },

  {
    files: ["**/*.cjs"],

    languageOptions: {
      sourceType: "commonjs",
    },
  },

  ...packageBoundaryConfigs,
);
