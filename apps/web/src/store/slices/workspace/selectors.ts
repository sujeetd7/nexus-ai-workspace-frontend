import type { RootState } from "../../root/rootReducer";

export const selectWorkspaceState = (state: RootState) => state.workspace;

export const selectSelectedWorkspaceId = (state: RootState) =>
  state.workspace.workspaceId;

export const selectWorkspaceStatus = (state: RootState) => state.workspace.status;

export const selectWorkspaceError = (state: RootState) => state.workspace.error;

export const selectIsWorkspaceReady = (state: RootState) =>
  state.workspace.status === "ready";
