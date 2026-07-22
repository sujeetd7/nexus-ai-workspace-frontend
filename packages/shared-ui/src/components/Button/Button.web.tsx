import type { CSSProperties, FC, MouseEvent } from "react";

import { opacity } from "../../theme/opacity";
import { useTheme } from "../../hooks/useTheme";
import { testProps } from "../shared/a11y";
import {
  resolveAccessibleName,
  resolveButtonLayout,
  resolveButtonSurface,
} from "./buttonTokens";
import type { ButtonProps } from "./Button.types";

const FOCUS_STYLE_ATTR = "data-nexus-button";
const FOCUS_STYLE_TAG_ID = "nexus-shared-ui-button-focus";

function ensureButtonFocusStyles(): void {
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
      outline: 2px solid var(--nexus-button-focus-ring);
      outline-offset: 2px;
    }
    [${FOCUS_STYLE_ATTR}]:hover:not(:disabled):not([aria-busy="true"]) {
      opacity: ${opacity.hover};
    }
    [${FOCUS_STYLE_ATTR}]:active:not(:disabled):not([aria-busy="true"]) {
      opacity: ${opacity.pressed};
    }
  `;
  doc.head.appendChild(style);
}

/**
 * Web Button — native HTML `<button>` with Nexus token styling.
 *
 * Disabled uses the native `disabled` attribute.
 * Loading uses `aria-busy` without forcing `disabled`, so focus is preserved.
 */
export const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  type = "button",
  onPress,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  ensureButtonFocusStyles();

  const { theme } = useTheme();
  const surface = resolveButtonSurface(theme, variant);
  const layout = resolveButtonLayout(size, fullWidth);
  const name = resolveAccessibleName(loading, accessibilityLabel, children);
  const blocksActivation = disabled || loading;

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
    gap: layout.gap,
    width: layout.width,
    alignSelf: layout.alignSelf,
    fontFamily: layout.fontFamily,
    fontSize: layout.fontSize,
    lineHeight: `${layout.lineHeight}px`,
    fontWeight: layout.fontWeight,
    cursor: blocksActivation ? "not-allowed" : "pointer",
    opacity: disabled ? layout.opacityDisabled : 1,
    ["--nexus-button-focus-ring" as string]: theme.semantic.focusRing,
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (blocksActivation) {
      event.preventDefault();
      return;
    }
    onPress?.();
  };

  return (
    <button
      {...testProps(testID)}
      {...{ [FOCUS_STYLE_ATTR]: true }}
      type={type}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-label={name}
      title={accessibilityHint}
      style={style}
      onClick={handleClick}
    >
      {loading ? null : leftIcon}
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "100%",
        }}
      >
        {loading ? "Loading…" : children}
      </span>
      {loading ? null : rightIcon}
    </button>
  );
};
