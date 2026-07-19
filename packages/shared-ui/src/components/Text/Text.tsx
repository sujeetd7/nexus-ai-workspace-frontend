import type { FC } from "react";

import type { TextProps } from "./Text.types";

export const Text: FC<TextProps> = ({ children }) => {
  return <span>{children}</span>;
};
