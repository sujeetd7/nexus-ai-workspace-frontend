import { isWeb, Text as TamaguiText } from "@tamagui/core";
import {
  createElement,
  type CSSProperties,
  type FC,
  type ReactNode,
} from "react";

import { opacity } from "../../theme/opacity";
import { useTheme } from "../../hooks/useTheme";
import { testProps } from "../shared/a11y";

export interface LabelProps {
  children: ReactNode;
  /** Web: associates with an Input `id`. Ignored on React Native. */
  htmlFor?: string;
  disabled?: boolean;
  required?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

/**
 * Level 1 label primitive for inputs.
 *
 * Web: renders a `<label>` and supports `htmlFor`.
 * React Native: renders accessible text; pair with Input `accessibilityLabel`
 * (RN has no htmlFor association).
 */
export const Label: FC<LabelProps> = ({
  children,
  htmlFor,
  disabled = false,
  required = false,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const content = (
    <>
      {children}
      {required ? " *" : null}
    </>
  );

  if (isWeb) {
    const style: CSSProperties = {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.size.label,
      lineHeight: `${theme.typography.lineHeight.label}px`,
      letterSpacing: theme.typography.letterSpacing.label,
      fontWeight: theme.typography.fontWeight.medium,
      color: disabled
        ? theme.semantic.textSecondary
        : theme.semantic.text,
      opacity: disabled ? opacity.disabled : undefined,
      margin: 0,
    };

    return createElement(
      "label",
      {
        ...testProps(testID),
        htmlFor,
        style,
        "aria-label": accessibilityLabel,
      },
      content,
    );
  }

  return (
    <TamaguiText
      {...testProps(testID)}
      fontFamily="$body"
      fontSize="$label"
      lineHeight="$label"
      letterSpacing="$label"
      fontWeight="$5"
      color={disabled ? "$colorSecondary" : "$color"}
      opacity={disabled ? opacity.disabled : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="text"
    >
      {content}
    </TamaguiText>
  );
};
