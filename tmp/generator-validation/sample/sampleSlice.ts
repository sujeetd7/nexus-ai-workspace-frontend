import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SampleState {
  loading: boolean;
}

const initialState: SampleState = {
  loading: false,
};

const sampleSlice = createSlice({
  name: "sample",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = sampleSlice.actions;

export default sampleSlice.reducer;
