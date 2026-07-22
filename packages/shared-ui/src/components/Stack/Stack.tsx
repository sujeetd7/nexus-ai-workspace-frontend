import { View as TamaguiView } from "@tamagui/core";
import type { FC } from "react";

import {
  resolveNativeAccessibilityRole,
  resolveWebRole,
  testProps,
} from "../shared/a11y";
import type {
  NexusA11yProps,
  NexusChildrenProps,
  NexusTestProps,
  SpacingToken,
} from "../shared/types";

export type StackDirection = "vertical" | "horizontal";
export type StackAlign = "start" | "center" | "end" | "stretch";
export type StackJustify =
  | "start"
  | "center"
  | "end"
  | "space-between"
  | "space-around"
  | "space-evenly";

const alignMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
} as const;

const justifyMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  "space-between": "space-between",
  "space-around": "space-around",
  "space-evenly": "space-evenly",
} as const;

type StackLayoutProps = {
  direction?: StackDirection;
  gap?: SpacingToken;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
};

export interface StackProps
  extends NexusChildrenProps, NexusA11yProps, NexusTestProps, StackLayoutProps {
  flex?: number;
  padding?: SpacingToken;
  /**
   * Responsive overrides via Tamagui media names (`sm`/`md`/`lg`/`xl`).
   * Uses the shared breakpoint/media foundation — no dimension listeners.
   */
  media?: Partial<
    Record<"sm" | "md" | "lg" | "xl", Omit<StackLayoutProps, never>>
  >;
}

function layoutToStyle(layout: StackLayoutProps) {
  return {
    flexDirection:
      layout.direction === "horizontal"
        ? ("row" as const)
        : ("column" as const),
    gap: layout.gap ? (`$${layout.gap}` as const) : undefined,
    alignItems: layout.align ? alignMap[layout.align] : undefined,
    justifyContent: layout.justify ? justifyMap[layout.justify] : undefined,
    flexWrap: layout.wrap ? ("wrap" as const) : undefined,
  };
}

/**
 * Level 1 layout primitive for arranging children. Not a page/grid system.
 */
export const Stack: FC<StackProps> = ({
  children,
  direction = "vertical",
  gap = "md",
  align,
  justify,
  wrap = false,
  flex,
  padding,
  media,
  testID,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
}) => {
  const role = resolveWebRole(accessibilityRole);
  const base = layoutToStyle({ direction, gap, align, justify, wrap });

  return (
    <TamaguiView
      {...testProps(testID)}
      display="flex"
      {...base}
      flex={flex}
      padding={padding ? `$${padding}` : undefined}
      $sm={media?.sm ? layoutToStyle(media.sm) : undefined}
      $md={media?.md ? layoutToStyle(media.md) : undefined}
      $lg={media?.lg ? layoutToStyle(media.lg) : undefined}
      $xl={media?.xl ? layoutToStyle(media.xl) : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={
        resolveNativeAccessibilityRole(accessibilityRole) as never
      }
      role={role as never}
    >
      {children}
    </TamaguiView>
  );
};

/** Horizontal stack alias — thin ergonomic wrapper, same public Stack API. */
export const XStack: FC<Omit<StackProps, "direction">> = (props) => (
  <Stack {...props} direction="horizontal" />
);

/** Vertical stack alias — thin ergonomic wrapper, same public Stack API. */
export const YStack: FC<Omit<StackProps, "direction">> = (props) => (
  <Stack {...props} direction="vertical" />
);
