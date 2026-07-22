import { View as TamaguiView } from "@tamagui/core";
import type { FC } from "react";

import { testProps } from "../shared/a11y";
import type { SpacingToken } from "../shared/types";

export type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps {
  orientation?: DividerOrientation;
  /**
   * When true (default), hides from assistive tech.
   * When false, exposes a separator role.
   */
  decorative?: boolean;
  /** Spacing around the divider using space tokens. */
  margin?: SpacingToken;
  /** @deprecated Prefer `orientation="vertical"`. */
  vertical?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

const orientationStyles = {
  horizontal: {
    height: 1,
    width: "100%" as const,
    alignSelf: "stretch" as const,
  },
  vertical: {
    width: 1,
    alignSelf: "stretch" as const,
    height: "100%" as const,
    minHeight: "$lg" as const,
  },
};

/**
 * Level 1 separator. Thickness uses a 1px hairline; color from `$borderColor`.
 * Hairline width is a platform separator convention (not a speculative design token).
 */
export const Divider: FC<DividerProps> = ({
  orientation,
  decorative = true,
  margin,
  vertical,
  testID,
  accessibilityLabel,
}) => {
  const resolvedOrientation: DividerOrientation =
    orientation ?? (vertical ? "vertical" : "horizontal");

  return (
    <TamaguiView
      {...testProps(testID)}
      backgroundColor="$borderColor"
      flexShrink={0}
      {...orientationStyles[resolvedOrientation]}
      margin={margin ? `$${margin}` : undefined}
      // Decorative: no SR noise. Semantic: separator role.
      accessible={!decorative}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? "no" : "yes"}
      aria-hidden={decorative || undefined}
      role={decorative ? "presentation" : "separator"}
      accessibilityRole={decorative ? undefined : "none"}
      accessibilityLabel={decorative ? undefined : accessibilityLabel}
    />
  );
};
