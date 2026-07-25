import { View as TamaguiView } from "@tamagui/core";
import type { FC } from "react";

import { useTheme } from "../../hooks/useTheme";
import { testProps } from "../shared/a11y";
import { iconSizeMap } from "./Icon.styles";
import type { IconProps } from "./Icon.types";

/**
 * Level 1 icon wrapper — policy and sizing only, not an icon library.
 * Compatible with Button `leftIcon` / `rightIcon` ReactNode slots.
 */
export const Icon: FC<IconProps> = ({
  children,
  size = "md",
  color = "text",
  decorative = true,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const dimension = iconSizeMap[size];
  const resolvedColor = theme.semantic[color];
  const isDecorative = decorative !== false;
  const label = isDecorative ? undefined : accessibilityLabel;

  if (!isDecorative && !accessibilityLabel) {
    console.error(
      "Icon: accessibilityLabel is required when decorative={false}.",
    );
  }

  return (
    <TamaguiView
      {...testProps(testID)}
      width={dimension}
      height={dimension}
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      // Decorative: hide from AT. Meaningful: expose label only.
      accessible={!isDecorative}
      accessibilityElementsHidden={isDecorative}
      importantForAccessibility={isDecorative ? "no" : "yes"}
      aria-hidden={isDecorative || undefined}
      accessibilityLabel={label}
      accessibilityRole={isDecorative ? undefined : "image"}
      // `color` enables SVG `currentColor` / inheriting text on web.
      style={{ color: resolvedColor }}
    >
      {children}
    </TamaguiView>
  );
};
