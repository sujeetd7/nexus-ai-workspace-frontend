import {
  darkSemanticColors,
  lightSemanticColors,
} from "../theme/semanticColors";
import type { ContrastLevel } from "./contrast";

/**
 * Documented semantic foreground/background pairs validated at WCAG AA.
 *
 * Exclusions (intentional — see ACCESSIBILITY.md / contrast tests):
 * - Borders as sole non-text contrast (subtle separators; non-text role TBD)
 * - Status colors used as body text (no onSuccess/onWarning/… text roles)
 */
export type ContrastPair = {
  id: string;
  theme: "light" | "dark";
  foregroundToken: string;
  backgroundToken: string;
  foreground: string;
  background: string;
  level: ContrastLevel;
};

export const REQUIRED_CONTRAST_PAIRS: readonly ContrastPair[] = [
  {
    id: "light.text/background",
    theme: "light",
    foregroundToken: "semantic.text",
    backgroundToken: "semantic.background",
    foreground: lightSemanticColors.text,
    background: lightSemanticColors.background,
    level: "aa-normal",
  },
  {
    id: "light.textSecondary/background",
    theme: "light",
    foregroundToken: "semantic.textSecondary",
    backgroundToken: "semantic.background",
    foreground: lightSemanticColors.textSecondary,
    background: lightSemanticColors.background,
    level: "aa-normal",
  },
  {
    id: "light.text/surface",
    theme: "light",
    foregroundToken: "semantic.text",
    backgroundToken: "semantic.surface",
    foreground: lightSemanticColors.text,
    background: lightSemanticColors.surface,
    level: "aa-normal",
  },
  {
    id: "light.textSecondary/surface",
    theme: "light",
    foregroundToken: "semantic.textSecondary",
    backgroundToken: "semantic.surface",
    foreground: lightSemanticColors.textSecondary,
    background: lightSemanticColors.surface,
    level: "aa-normal",
  },
  {
    id: "light.primary/background",
    theme: "light",
    foregroundToken: "semantic.primary",
    backgroundToken: "semantic.background",
    foreground: lightSemanticColors.primary,
    background: lightSemanticColors.background,
    level: "aa-normal",
  },
  {
    id: "light.onPrimary/primary",
    theme: "light",
    foregroundToken: "semantic.onPrimary",
    backgroundToken: "semantic.primary",
    foreground: lightSemanticColors.onPrimary,
    background: lightSemanticColors.primary,
    level: "aa-normal",
  },
  {
    id: "light.onDanger/danger",
    theme: "light",
    foregroundToken: "semantic.onDanger",
    backgroundToken: "semantic.danger",
    foreground: lightSemanticColors.onDanger,
    background: lightSemanticColors.danger,
    level: "aa-normal",
  },
  {
    id: "light.focusRing/background",
    theme: "light",
    foregroundToken: "semantic.focusRing",
    backgroundToken: "semantic.background",
    foreground: lightSemanticColors.focusRing,
    background: lightSemanticColors.background,
    level: "aa-large",
  },
  {
    id: "dark.text/background",
    theme: "dark",
    foregroundToken: "semantic.text",
    backgroundToken: "semantic.background",
    foreground: darkSemanticColors.text,
    background: darkSemanticColors.background,
    level: "aa-normal",
  },
  {
    id: "dark.textSecondary/background",
    theme: "dark",
    foregroundToken: "semantic.textSecondary",
    backgroundToken: "semantic.background",
    foreground: darkSemanticColors.textSecondary,
    background: darkSemanticColors.background,
    level: "aa-normal",
  },
  {
    id: "dark.text/surface",
    theme: "dark",
    foregroundToken: "semantic.text",
    backgroundToken: "semantic.surface",
    foreground: darkSemanticColors.text,
    background: darkSemanticColors.surface,
    level: "aa-normal",
  },
  {
    id: "dark.textSecondary/surface",
    theme: "dark",
    foregroundToken: "semantic.textSecondary",
    backgroundToken: "semantic.surface",
    foreground: darkSemanticColors.textSecondary,
    background: darkSemanticColors.surface,
    level: "aa-normal",
  },
  {
    id: "dark.primary/background",
    theme: "dark",
    foregroundToken: "semantic.primary",
    backgroundToken: "semantic.background",
    foreground: darkSemanticColors.primary,
    background: darkSemanticColors.background,
    level: "aa-normal",
  },
  {
    id: "dark.onPrimary/primary",
    theme: "dark",
    foregroundToken: "semantic.onPrimary",
    backgroundToken: "semantic.primary",
    foreground: darkSemanticColors.onPrimary,
    background: darkSemanticColors.primary,
    level: "aa-normal",
  },
  {
    id: "dark.onDanger/danger",
    theme: "dark",
    foregroundToken: "semantic.onDanger",
    backgroundToken: "semantic.danger",
    foreground: darkSemanticColors.onDanger,
    background: darkSemanticColors.danger,
    level: "aa-normal",
  },
  {
    id: "dark.focusRing/background",
    theme: "dark",
    foregroundToken: "semantic.focusRing",
    backgroundToken: "semantic.background",
    foreground: darkSemanticColors.focusRing,
    background: darkSemanticColors.background,
    level: "aa-large",
  },
] as const;
