import type { ReactNode } from "react";

export type TextVariant =
  | "display"
  | "title"
  | "heading"
  | "body"
  | "caption"
  | "label";

export interface TextProps {
  children: ReactNode;

  variant?: TextVariant;

  color?: string;

  align?: "left" | "center" | "right";
}
