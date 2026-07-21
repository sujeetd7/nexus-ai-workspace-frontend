import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface WorkspaceState {
  currentWorkspaceId?: string;
}

const initialState: WorkspaceState = {};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspace(state, action: PayloadAction<string>) {
      state.currentWorkspaceId = action.payload;
    },

    clearWorkspace(state) {
      state.currentWorkspaceId = undefined;
    },
  },
});

export const { setWorkspace, clearWorkspace } = workspaceSlice.actions;

export default workspaceSlice.reducer;
