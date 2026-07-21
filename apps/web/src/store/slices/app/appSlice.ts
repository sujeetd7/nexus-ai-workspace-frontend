import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  initialized: boolean;
  loading: boolean;
}

const initialState: AppState = {
  initialized: false,
  loading: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    initialize(state) {
      state.initialized = true;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { initialize, setLoading } = appSlice.actions;

export default appSlice.reducer;
