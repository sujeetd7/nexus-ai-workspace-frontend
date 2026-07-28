import type { CSSProperties, FC, MouseEvent } from "react";

import { opacity } from "../../theme/opacity";
import { useTheme } from "../../hooks/useTheme";
import { Loader } from "../Loader";
import { mapWebDomProps } from "../shared/a11y";
import {
  resolveIconButtonAccessibleName,
  resolveIconButtonLayout,
  resolveIconButtonSurface,
} from "./iconButtonTokens";
import type { IconButtonProps } from "./IconButton.types";

const FOCUS_STYLE_ATTR = "data-nexus-icon-button";
const FOCUS_STYLE_TAG_ID = "nexus-shared-ui-icon-button-focus";

function ensureIconButtonFocusStyles(): void {
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
      outline: 2px solid var(--nexus-icon-button-focus-ring);
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
 * Web IconButton — icon-only button with required accessibility label.
 */
export const IconButton: FC<IconButtonProps> = ({
  children,
  accessibilityLabel,
  accessibilityHint,
  variant = "ghost",
  size = "md",
  shape = "default",
  loading = false,
  disabled = false,
  onPress,
  testID,
}) => {
  ensureIconButtonFocusStyles();

  const { theme } = useTheme();
  const surface = resolveIconButtonSurface(theme, variant);
  const layout = resolveIconButtonLayout(size, shape);
  const name = resolveIconButtonAccessibleName(loading, accessibilityLabel);
  const blocksActivation = disabled || loading;

  const style: CSSProperties = {
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
    borderStyle: "solid",
    borderWidth: layout.borderWidth,
    borderRadius: layout.borderRadius,
    borderColor: surface.borderColor,
    backgroundColor: surface.backgroundColor,
    color: surface.color,
    width: layout.width,
    height: layout.height,
    minHeight: layout.minHeight,
    minWidth: layout.minWidth,
    cursor: blocksActivation ? "not-allowed" : "pointer",
    opacity: disabled ? layout.opacityDisabled : 1,
    ["--nexus-icon-button-focus-ring" as string]: theme.semantic.focusRing,
  };

  return (
    <button
      {...mapWebDomProps(
        {
          testID,
          accessibilityLabel: name,
          accessibilityHint,
        },
        { omitWebRole: true },
      )}
      {...{ [FOCUS_STYLE_ATTR]: true }}
      type="button"
      disabled={disabled}
      aria-busy={loading || undefined}
      style={style}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        if (blocksActivation) {
          event.preventDefault();
          return;
        }
        onPress?.();
      }}
    >
      {loading ? (
        <Loader
          size="sm"
          color={variant === "primary" || variant === "destructive" ? "onPrimary" : "primary"}
          accessibilityLabel={name}
        />
      ) : (
        children
      )}
    </button>
  );
};
