import type { FC } from "react";
import { Pressable } from "react-native";

import { useTheme } from "../../hooks/useTheme";
import { View } from "../View";
import { getNativeAccessibilityProps } from "../shared/a11y";
import { ListRowBody } from "./ListRowBody";
import {
  resolveListRowLayout,
  resolveListRowSurface,
} from "./listRowTokens";
import {
  resolveListRowAccessibleName,
  type ListRowProps,
} from "./ListRow.types";

/**
 * React Native ListRow — Pressable when interactive; View otherwise.
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
  const { theme } = useTheme();
  const interactive = typeof onPress === "function";
  const name = resolveListRowAccessibleName(accessibilityLabel, title);
  const surface = resolveListRowSurface(theme, selected);
  const layout = resolveListRowLayout();

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

  const layoutStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: layout.gap,
    minHeight: layout.minHeight,
    paddingHorizontal: layout.paddingHorizontal,
    paddingVertical: layout.paddingVertical,
    borderRadius: layout.borderRadius,
    backgroundColor: surface.backgroundColor,
    borderWidth: surface.borderWidth,
    borderColor: surface.borderColor,
  };

  if (!interactive) {
    return (
      <View
        testID={testID}
        accessibilityLabel={name}
        accessibilityHint={accessibilityHint}
        accessibilityRole="listitem"
        minHeight={layout.minHeight}
        style={{
          ...layoutStyle,
          opacity: disabled ? layout.opacityDisabled : 1,
        }}
      >
        {body}
      </View>
    );
  }

  return (
    <Pressable
      {...getNativeAccessibilityProps({
        testID,
        accessibilityLabel: name,
        accessibilityHint,
        accessibilityRole: "button",
        accessibilityState: { disabled, selected },
      })}
      disabled={disabled}
      onPress={() => {
        if (disabled) {
          return;
        }
        onPress?.();
      }}
      style={({ pressed }) => ({
        ...layoutStyle,
        opacity: disabled
          ? layout.opacityDisabled
          : pressed
            ? layout.opacityPressed
            : 1,
      })}
    >
      {body}
    </Pressable>
  );
};
