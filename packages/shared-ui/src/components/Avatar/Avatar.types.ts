import type { ReactNode } from "react";

import type { NexusTestProps } from "../shared/types";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps extends NexusTestProps {
  /** Pixel image URI. When set and loadable, takes precedence over initials/icon. */
  src?: string;
  /** Accessible name for the image / person. Required when not decorative. */
  alt?: string;
  /** Initials fallback (typically 1–2 characters). */
  initials?: string;
  /** Icon / glyph fallback when no image or initials. */
  icon?: ReactNode;
  size?: AvatarSize;
  /**
   * When true (default if no `alt`), hide from assistive tech.
   * When false / when `alt` is provided, expose as an image with that label.
   */
  decorative?: boolean;
  accessibilityLabel?: string;
}
