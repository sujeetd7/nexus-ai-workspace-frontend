import type { CSSProperties, FC, KeyboardEvent, MouseEvent } from "react";

import { useTheme } from "../../hooks/useTheme";
import { mapWebDomProps } from "../shared/a11y";
import { resolveSwitchLayout, resolveSwitchSurface } from "./switchTokens";
import type { SwitchProps } from "./Switch.types";

const FOCUS_STYLE_ATTR = "data-nexus-switch";
const FOCUS_STYLE_TAG_ID = "nexus-shared-ui-switch-focus";

function ensureSwitchFocusStyles(): void {
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
      outline: 2px solid var(--nexus-switch-focus-ring);
      outline-offset: 2px;
    }
  `;
  doc.head.appendChild(style);
}

/**
 * Web Switch — controlled toggle with switch role and keyboard support.
 */
export const Switch: FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  ensureSwitchFocusStyles();

  const { theme } = useTheme();
  const surface = resolveSwitchSurface(theme, checked);
  const layout = resolveSwitchLayout();
  const thumbOffset = checked
    ? layout.trackWidth - layout.trackPadding * 2 - layout.thumbSize
    : 0;

  const trackStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    boxSizing: "border-box",
    margin: 0,
    padding: layout.trackPadding,
    width: layout.trackWidth,
    height: layout.trackHeight,
    minHeight: layout.minHeight,
    minWidth: layout.minWidth,
    borderRadius: layout.borderRadius,
    border: "none",
    backgroundColor: surface.trackColor,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? layout.opacityDisabled : 1,
    position: "relative",
    ["--nexus-switch-focus-ring" as string]: theme.semantic.focusRing,
  };

  const thumbStyle: CSSProperties = {
    width: layout.thumbSize,
    height: layout.thumbSize,
    borderRadius: layout.borderRadius,
    backgroundColor: surface.thumbColor,
    transform: `translateX(${thumbOffset}px)`,
    boxShadow: theme.shadows.sm,
  };

  const toggle = () => {
    if (disabled) {
      return;
    }
    onCheckedChange(!checked);
  };

  return (
    <button
      {...mapWebDomProps(
        {
          testID,
          accessibilityLabel,
          accessibilityHint,
          accessibilityRole: "switch",
          accessibilityState: { disabled, checked },
        },
        { omitWebRole: false },
      )}
      {...{ [FOCUS_STYLE_ATTR]: true }}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      style={trackStyle}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        toggle();
      }}
      onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          toggle();
        }
      }}
    >
      <span style={thumbStyle} />
    </button>
  );
};
