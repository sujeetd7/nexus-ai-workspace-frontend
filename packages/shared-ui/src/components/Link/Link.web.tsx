import type { CSSProperties, FC, MouseEvent } from "react";

import { useTheme } from "../../hooks/useTheme";
import { testProps } from "../shared/a11y";
import {
  resolveLinkAccessibleName,
  resolveLinkColor,
  resolveLinkTypography,
} from "./linkTokens";
import type { LinkProps } from "./Link.types";

const FOCUS_STYLE_ATTR = "data-nexus-link";
const FOCUS_STYLE_TAG_ID = "nexus-shared-ui-link-focus";

function ensureLinkFocusStyles(): void {
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
      outline: 2px solid var(--nexus-link-focus-ring);
      outline-offset: 2px;
    }
    [${FOCUS_STYLE_ATTR}]:hover:not([aria-disabled="true"]) {
      opacity: var(--nexus-link-hover-opacity);
    }
    [${FOCUS_STYLE_ATTR}]:active:not([aria-disabled="true"]) {
      opacity: var(--nexus-link-pressed-opacity);
    }
  `;
  doc.head.appendChild(style);
}

/**
 * Web Link — native `<a>` with Nexus token styling.
 * Not a Button alias; no routing-library coupling.
 */
export const Link: FC<LinkProps> = ({
  children,
  href,
  onPress,
  disabled = false,
  external = false,
  variant = "default",
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  ensureLinkFocusStyles();

  const { theme } = useTheme();
  const color = resolveLinkColor(theme, variant);
  const type = resolveLinkTypography();
  const name = resolveLinkAccessibleName(accessibilityLabel, children);

  const style: CSSProperties = {
    color,
    fontFamily: type.fontFamily,
    fontSize: type.fontSize,
    lineHeight: `${type.lineHeight}px`,
    fontWeight: type.fontWeight,
    textDecorationLine: "underline",
    textUnderlineOffset: 2,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? type.opacityDisabled : 1,
    ["--nexus-link-focus-ring" as string]: theme.semantic.focusRing,
    ["--nexus-link-hover-opacity" as string]: String(type.opacityHover),
    ["--nexus-link-pressed-opacity" as string]: String(type.opacityPressed),
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onPress?.();
  };

  return (
    <a
      {...testProps(testID)}
      {...{ [FOCUS_STYLE_ATTR]: true }}
      href={disabled ? undefined : href}
      target={external && !disabled ? "_blank" : undefined}
      rel={external && !disabled ? "noopener noreferrer" : undefined}
      aria-disabled={disabled || undefined}
      aria-label={name}
      title={accessibilityHint}
      tabIndex={disabled ? -1 : undefined}
      style={style}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};
