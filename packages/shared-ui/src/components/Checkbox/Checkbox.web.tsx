import type { CSSProperties, FC, KeyboardEvent, MouseEvent } from "react";
import { useState } from "react";

import { useTheme } from "../../hooks/useTheme";
import { testProps } from "../shared/a11y";
import {
  resolveCheckboxLayout,
  resolveCheckboxSurface,
} from "./checkboxTokens";
import type { CheckboxProps } from "./Checkbox.types";

const FOCUS_STYLE_ATTR = "data-nexus-checkbox";
const FOCUS_STYLE_TAG_ID = "nexus-shared-ui-checkbox-focus";

function ensureCheckboxFocusStyles(): void {
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
      outline: 2px solid var(--nexus-checkbox-focus-ring);
      outline-offset: 2px;
    }
  `;
  doc.head.appendChild(style);
}

function resolveAriaChecked(
  checked: boolean,
  indeterminate: boolean,
): boolean | "mixed" {
  if (indeterminate) {
    return "mixed";
  }
  return checked;
}

/**
 * Web Checkbox — button with checkbox role (supports indeterminate correctly).
 */
export const Checkbox: FC<CheckboxProps> = ({
  checked: checkedProp,
  defaultChecked = false,
  indeterminate = false,
  disabled = false,
  onCheckedChange,
  label,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  ensureCheckboxFocusStyles();

  const { theme } = useTheme();
  const layout = resolveCheckboxLayout();
  const isControlled = checkedProp !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const checked = isControlled ? Boolean(checkedProp) : uncontrolled;
  const surface = resolveCheckboxSurface(theme, checked, indeterminate);
  const name =
    accessibilityLabel ??
    (typeof label === "string" ? label : undefined);

  const toggle = () => {
    if (disabled) {
      return;
    }
    const next = indeterminate ? true : !checked;
    if (!isControlled) {
      setUncontrolled(next);
    }
    onCheckedChange?.(next);
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    toggle();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      toggle();
    }
  };

  const rootStyle: CSSProperties = {
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    gap: layout.gap,
    margin: 0,
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? layout.opacityDisabled : 1,
    minHeight: layout.minTarget,
    minWidth: layout.minTarget,
    fontFamily: layout.fontFamily,
    fontSize: layout.fontSize,
    lineHeight: `${layout.lineHeight}px`,
    fontWeight: layout.fontWeight,
    color: theme.semantic.text,
    ["--nexus-checkbox-focus-ring" as string]: theme.semantic.focusRing,
  };

  const boxStyle: CSSProperties = {
    width: layout.boxSize,
    height: layout.boxSize,
    borderRadius: layout.borderRadius,
    borderStyle: "solid",
    borderWidth: layout.borderWidth,
    borderColor: surface.borderColor,
    backgroundColor: surface.backgroundColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    color: surface.markColor,
    fontSize: layout.boxSize * 0.75,
    lineHeight: 1,
  };

  return (
    <button
      {...testProps(testID)}
      {...{ [FOCUS_STYLE_ATTR]: true }}
      type="button"
      role="checkbox"
      aria-checked={resolveAriaChecked(checked, indeterminate)}
      aria-disabled={disabled || undefined}
      aria-label={name}
      title={accessibilityHint}
      disabled={disabled}
      style={rootStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span style={boxStyle} aria-hidden>
        {indeterminate ? "−" : checked ? "✓" : null}
      </span>
      {label != null && label !== false ? <span>{label}</span> : null}
    </button>
  );
};
