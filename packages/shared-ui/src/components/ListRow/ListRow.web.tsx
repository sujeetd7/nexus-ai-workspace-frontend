import type { CSSProperties, FC, MouseEvent } from "react";

import { opacity } from "../../theme/opacity";
import { useTheme } from "../../hooks/useTheme";
import { mapWebDomProps } from "../shared/a11y";
import { ListRowBody } from "./ListRowBody";
import {
  resolveListRowLayout,
  resolveListRowSurface,
} from "./listRowTokens";
import {
  resolveListRowAccessibleName,
  type ListRowProps,
} from "./ListRow.types";

const FOCUS_STYLE_ATTR = "data-nexus-list-row";
const FOCUS_STYLE_TAG_ID = "nexus-shared-ui-list-row-focus";

function ensureListRowFocusStyles(): void {
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
      outline: 2px solid var(--nexus-list-row-focus-ring);
      outline-offset: 2px;
    }
    button[${FOCUS_STYLE_ATTR}]:hover:not(:disabled) {
      opacity: ${opacity.hover};
    }
    button[${FOCUS_STYLE_ATTR}]:active:not(:disabled) {
      opacity: ${opacity.pressed};
    }
  `;
  doc.head.appendChild(style);
}

/**
 * Web ListRow — native `<button>` when interactive; `<div role="listitem">` otherwise.
 */
export const ListRow: FC<ListRowProps> = ({
  leading,
  title,
  subtitle,
  description,
  trailing,
  selected = false,
  disabled = false,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  ensureListRowFocusStyles();

  const { theme } = useTheme();
  const interactive = typeof onPress === "function";
  const name = resolveListRowAccessibleName(accessibilityLabel, title);
  const surface = resolveListRowSurface(theme, selected);
  const layout = resolveListRowLayout();

  const style: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    boxSizing: "border-box",
    width: "100%",
    margin: 0,
    textAlign: "left",
    font: "inherit",
    color: "inherit",
    cursor: interactive && !disabled ? "pointer" : "default",
    gap: layout.gap,
    minHeight: layout.minHeight,
    paddingLeft: layout.paddingHorizontal,
    paddingRight: layout.paddingHorizontal,
    paddingTop: layout.paddingVertical,
    paddingBottom: layout.paddingVertical,
    borderRadius: layout.borderRadius,
    borderStyle: "solid",
    borderWidth: surface.borderWidth,
    borderColor: surface.borderColor,
    backgroundColor: surface.backgroundColor,
    opacity: disabled ? layout.opacityDisabled : 1,
    ["--nexus-list-row-focus-ring" as string]: theme.semantic.focusRing,
  };

  const body = (
    <ListRowBody
      leading={leading}
      title={title}
      subtitle={subtitle}
      description={description}
      trailing={trailing}
      testID={testID}
    />
  );

  if (!interactive) {
    return (
      <div
        {...mapWebDomProps({
          testID,
          accessibilityLabel: name,
          accessibilityHint,
          accessibilityRole: "listitem",
          accessibilityState: { disabled, selected },
        })}
        {...{ [FOCUS_STYLE_ATTR]: true }}
        style={style}
      >
        {body}
      </div>
    );
  }

  return (
    <button
      {...mapWebDomProps(
        {
          testID,
          accessibilityLabel: name,
          accessibilityHint,
          accessibilityState: { disabled, selected },
        },
        { omitWebRole: true },
      )}
      {...{ [FOCUS_STYLE_ATTR]: true }}
      type="button"
      disabled={disabled}
      aria-selected={selected || undefined}
      style={style}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onPress?.();
      }}
    >
      {body}
    </button>
  );
};
