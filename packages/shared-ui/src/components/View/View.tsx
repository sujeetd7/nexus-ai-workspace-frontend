import type { FC } from "react";

import type { ViewProps } from "./View.types";

export const View: FC<ViewProps> = ({ children, style }) => {
  return <div style={style}>{children}</div>;
};
