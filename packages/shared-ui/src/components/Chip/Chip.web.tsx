import type { CSSProperties, FC, MouseEvent } from "react";

import { useTheme } from "../../hooks/useTheme";
import { testProps } from "../shared/a11y";
import {
  resolveChipAccessibleName,
  resolveChipLayout,
  resolveChipSurface,
} from "./chipTokens";
import type { ChipProps } from "./Chip.types";

const FOCUS_STYLE_ATTR = "data-nexus-chip";
const FOCUS_STYLE_TAG_ID = "nexus-shared-ui-chip-focus";

function ensureChipFocusStyles(): void {
  const root = globalThis as typeof globalThis & {
    document?: {
      getElementById: (id: string) => { id: string } | null;
      createElement: (tag: string) => {
        id: string;
        textContent: string;
      };
      head?: { appendChild: (node: unknown) => void };
    };
  };
  const doc = root.document;
  if (!doc?.head) {
    return;
  }
  if (doc.getElementById(FOCUS_STYLE_TAG_ID)) {
    return;
  }
  const style = doc.createElement("style");
  style.id = FOCUS_STYLE_TAG_ID;
  style.textContent = `
    [${FOCUS_STYLE_ATTR}]:focus { outline: none; }
    [${FOCUS_STYLE_ATTR}]:focus-visible {
      outline: 2px solid var(--nexus-chip-focus-ring);
      outline-offset: 2px;
    }
  `;
  doc.head.appendChild(style);
}

/**
 * Web Chip — native HTML `<button>` selection control (not removable).
 */
export const Chip: FC<ChipProps> = ({
  children,
  selected = false,
  disabled = false,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  ensureChipFocusStyles();

  const { theme } = useTheme();
  const surface = resolveChipSurface(theme, selected);
  const layout = resolveChipLayout();
  const name = resolveChipAccessibleName(
    accessibilityLabel,
    children,
    selected,
  );

  const style: CSSProperties = {
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    margin: 0,
    borderStyle: "solid",
    borderWidth: layout.borderWidth,
    borderRadius: layout.borderRadius,
    borderColor: surface.borderColor,
    backgroundColor: surface.backgroundColor,
    color: surface.color,
    minHeight: layout.minHeight,
    minWidth: layout.minWidth,
    paddingLeft: layout.paddingHorizontal,
    paddingRight: layout.paddingHorizontal,
    paddingTop: layout.paddingVertical,
    paddingBottom: layout.paddingVertical,
    fontFamily: layout.fontFamily,
    fontSize: layout.fontSize,
    lineHeight: `${layout.lineHeight}px`,
    fontWeight: layout.fontWeight,
    opacity: disabled ? layout.opacityDisabled : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    ["--nexus-chip-focus-ring" as string]: theme.semantic.focusRing,
  };

  return (
    <button
      {...testProps(testID)}
      {...{ [FOCUS_STYLE_ATTR]: true }}
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      aria-label={name}
      title={accessibilityHint}
      style={style}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onPress?.();
      }}
    >
      {children}
    </button>
  );
};
