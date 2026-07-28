import type { CSSProperties } from "react";

export const sidebarInnerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: 0,
};

export const sidebarScrollStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
};

export const sidebarSectionStyle: CSSProperties = {
  paddingLeft: 12,
  paddingRight: 12,
};
