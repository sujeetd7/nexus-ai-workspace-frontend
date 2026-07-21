import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UIState {
  sidebarCollapsed: boolean;
  globalLoader: boolean;
}

const initialState: UIState = {
  sidebarCollapsed: false,
  globalLoader: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    setGlobalLoader(state, action: PayloadAction<boolean>) {
      state.globalLoader = action.payload;
    },
  },
});

export const { toggleSidebar, setGlobalLoader } = uiSlice.actions;

export default uiSlice.reducer;
