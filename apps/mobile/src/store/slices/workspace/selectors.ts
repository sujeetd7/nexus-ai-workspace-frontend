import type { RootReducerState } from '../../rootReducer';

export const selectSelectedWorkspaceId = (state: RootReducerState) =>
  state.workspace.workspaceId;

export const selectWorkspaceStatus = (state: RootReducerState) =>
  state.workspace.status;

export const selectWorkspaceError = (state: RootReducerState) =>
  state.workspace.error;

export const selectIsWorkspaceReady = (state: RootReducerState) =>
  state.workspace.status === 'ready';
