import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "./types";

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
  authenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginRequest(state) {
      state.loading = true;
    },

    loginSuccess(
      state,
      action: PayloadAction<{
        token: string;
        refreshToken: string;
        user: User;
      }>,
    ) {
      state.loading = false;

      state.token = action.payload.token;

      state.refreshToken = action.payload.refreshToken;

      state.user = action.payload.user;

      state.authenticated = true;
    },

    loginFailure(state) {
      state.loading = false;
    },

    logout(state) {
      state.token = null;

      state.refreshToken = null;

      state.user = null;

      state.authenticated = false;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } =
  authSlice.actions;

export default authSlice.reducer;
