import { View as TamaguiView } from "@tamagui/core";
import type { FC } from "react";
import { useState } from "react";
import { Image } from "react-native";

import { useTheme } from "../../hooks/useTheme";
import { Text } from "../Text";
import { getTamaguiAccessibilityProps } from "../shared/a11y";
import {
  avatarFontSizeMap,
  avatarSizeMap,
  resolveAvatarLabel,
} from "./avatarTokens";
import type { AvatarProps } from "./Avatar.types";

/**
 * Level 2 avatar — image, initials, or icon fallback.
 * Presence indicators deferred (no presence token system).
 */
export const Avatar: FC<AvatarProps> = ({
  src,
  alt,
  initials,
  icon,
  size = "md",
  decorative: decorativeProp,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const [imageFailed, setImageFailed] = useState(false);
  const dimension = avatarSizeMap[size];
  const fontSize = avatarFontSizeMap[size];
  const showImage = Boolean(src) && !imageFailed;
  const isDecorative =
    decorativeProp !== undefined ? decorativeProp : !alt && !accessibilityLabel;
  const label = resolveAvatarLabel(
    isDecorative,
    alt,
    accessibilityLabel,
    initials,
  );

  const content = showImage ? (
    <Image
      source={{ uri: src }}
      onError={() => {
        setImageFailed(true);
      }}
      style={{
        width: dimension,
        height: dimension,
        borderRadius: dimension / 2,
      }}
    />
  ) : initials ? (
    <Text
      weight="semibold"
      color="text"
      style={{ fontSize, lineHeight: fontSize }}
    >
      {initials.slice(0, 2).toUpperCase()}
    </Text>
  ) : icon ? (
    icon
  ) : (
    <Text weight="semibold" color="textSecondary" style={{ fontSize }}>
      ?
    </Text>
  );

  return (
    <TamaguiView
      {...getTamaguiAccessibilityProps(
        {
          testID,
          accessibilityLabel: label,
        },
        {
          hidden: isDecorative,
          webRole: isDecorative ? undefined : "img",
          nativeAccessibilityRole: isDecorative ? undefined : "image",
        },
      )}
      width={dimension}
      height={dimension}
      minWidth={dimension}
      minHeight={dimension}
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      backgroundColor="$surfaceMuted"
      borderWidth={1}
      borderColor="$borderColor"
      style={{
        borderRadius: dimension / 2,
        borderColor: theme.semantic.border,
      }}
    >
      {content}
    </TamaguiView>
  );
};
