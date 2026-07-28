import type { CSSProperties } from "react";

/** Sidebar width aligned to screenshot shell proportions (Batch 5.DS.0). */
export const SIDEBAR_WIDTH_PX = 260;

export const TOPBAR_HEIGHT_PX = 56;

export const skipLinkStyle: CSSProperties = {
  position: "absolute",
  left: 16,
  top: 16,
  zIndex: 1100,
  padding: "8px 12px",
  backgroundColor: "var(--background, #ffffff)",
  color: "inherit",
  textDecoration: "none",
  borderRadius: 4,
  transform: "translateY(-220%)",
};

export const shellRootStyle: CSSProperties = {
  minHeight: "100vh",
  position: "relative",
};

export const shellBodyStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "row",
};

export const sidebarStyle = (visible: boolean, overlay: boolean): CSSProperties => ({
  width: SIDEBAR_WIDTH_PX,
  flexShrink: 0,
  display: visible ? "flex" : "none",
  flexDirection: "column",
  ...(overlay
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 1000,
        boxShadow: "2px 0 12px rgba(0, 0, 0, 0.12)",
      }
    : {}),
});

export const drawerBackdropStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 999,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  border: "none",
  padding: 0,
  cursor: "pointer",
};

export const mainColumnStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
};

export const mainContentStyle: CSSProperties = {
  flex: 1,
  outline: "none",
  overflow: "auto",
};
