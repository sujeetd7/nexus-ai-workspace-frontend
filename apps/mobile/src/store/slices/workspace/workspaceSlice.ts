import type { SelectedWorkspaceState } from '@nexus/shared-types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: SelectedWorkspaceState = {
  status: 'uninitialized',
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    workspaceBootstrapStarted(state) {
      state.status = 'loading';
      state.error = undefined;
    },
    workspaceBootstrapSucceeded(
      state,
      action: PayloadAction<string | undefined>,
    ) {
      state.workspaceId = action.payload;
      state.status = 'ready';
      state.error = undefined;
    },
    workspaceBootstrapFailed(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },
    setSelectedWorkspace(state, action: PayloadAction<string>) {
      state.workspaceId = action.payload;
      state.status = 'ready';
      state.error = undefined;
    },
    clearSelectedWorkspace(state) {
      state.workspaceId = undefined;
      state.status = 'ready';
      state.error = undefined;
    },
  },
});

export const {
  workspaceBootstrapStarted,
  workspaceBootstrapSucceeded,
  workspaceBootstrapFailed,
  setSelectedWorkspace,
  clearSelectedWorkspace,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
