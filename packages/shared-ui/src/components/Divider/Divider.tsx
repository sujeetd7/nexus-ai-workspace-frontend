import type { FC } from "react";

import type { DividerProps } from "./Divider.types";

export const Divider: FC<DividerProps> = ({ vertical }) => {
  return (
    <hr
      style={{
        width: vertical ? 1 : "100%",
        height: vertical ? "100%" : 1,
      }}
    />
  );
};
