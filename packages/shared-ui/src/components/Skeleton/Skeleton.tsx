import type { FC } from "react";

import { View } from "../View";
import type {
  NexusTestProps,
  RadiusToken,
  SemanticBackground,
  SpacingToken,
} from "../shared/types";
import { avatarSizeMap } from "../Avatar/avatarTokens";
import type { AvatarSize } from "../Avatar/Avatar.types";

export type SkeletonVariant =
  | "text"
  | "title"
  | "avatar"
  | "rectangle"
  | "rounded"
  | "card";

export interface SkeletonProps extends NexusTestProps {
  variant?: SkeletonVariant;
  /** Optional width override (number = px, or percentage string). */
  width?: number | `${number}%` | "100%";
  /** Optional height override in px. */
  height?: number;
  /** Avatar size when `variant="avatar"`. */
  avatarSize?: AvatarSize;
  background?: SemanticBackground;
  accessibilityLabel?: string;
}

const textHeight = 12;
const titleHeight = 20;

/**
 * Level 2 loading placeholder — static muted blocks (no shimmer library).
 * Prefer composing multiple Skeletons for card/list loading states.
 */
export const Skeleton: FC<SkeletonProps> = ({
  variant = "text",
  width,
  height,
  avatarSize = "md",
  background = "surfaceMuted",
  accessibilityLabel = "Loading",
  testID,
}) => {
  let resolvedWidth: number | `${number}%` | "100%";
  let resolvedHeight: number;
  let borderRadius: RadiusToken | undefined;
  let padding: SpacingToken | undefined;

  switch (variant) {
    case "title":
      resolvedHeight = height ?? titleHeight;
      resolvedWidth = width ?? "60%";
      borderRadius = "sm";
      break;
    case "avatar": {
      const dim = avatarSizeMap[avatarSize];
      resolvedWidth = width ?? dim;
      resolvedHeight = height ?? dim;
      borderRadius = "pill";
      break;
    }
    case "rectangle":
      resolvedHeight = height ?? 80;
      resolvedWidth = width ?? "100%";
      borderRadius = "none";
      break;
    case "rounded":
      resolvedHeight = height ?? 80;
      resolvedWidth = width ?? "100%";
      borderRadius = "lg";
      break;
    case "card":
      resolvedHeight = height ?? 120;
      resolvedWidth = width ?? "100%";
      borderRadius = "lg";
      padding = "md";
      break;
    case "text":
    default:
      resolvedHeight = height ?? textHeight;
      resolvedWidth = width ?? "100%";
      borderRadius = "sm";
      break;
  }

  return (
    <View
      testID={testID}
      background={background}
      width={resolvedWidth}
      height={resolvedHeight}
      minHeight={resolvedHeight}
      borderRadius={borderRadius}
      padding={padding}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progress"
      style={{
        overflow: "hidden",
      }}
    />
  );
};
