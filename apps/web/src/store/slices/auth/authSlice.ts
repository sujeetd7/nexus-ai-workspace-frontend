import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthResponse, AuthState, AuthUser } from "./types";

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  authenticated: false,
  loading: false,
  initialized: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginRequest(state) {
      state.loading = true;
      state.error = null;
    },

    authSuccess(state, action: PayloadAction<AuthResponse>) {
      state.accessToken = action.payload.tokens.accessToken;

      state.refreshToken = action.payload.tokens.refreshToken;

      state.user = action.payload.user;
      state.authenticated = true;
      state.loading = false;
      state.initialized = true;
      state.status = "authenticated";
      state.error = null;
    },

    authFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.authenticated = false;
      state.status = "unauthenticated";
      state.error = action.payload;
    },

    sessionRestoreStarted(state) {
      state.loading = true;
      state.status = "restoring";
      state.error = null;
    },

    sessionTokensRestored(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>,
    ) {
      state.accessToken = action.payload.accessToken;

      state.refreshToken = action.payload.refreshToken;

      state.loading = false;
      state.initialized = true;
      state.status = "authenticated";
      state.authenticated = true;
    },

    sessionUserUpdated(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },

    sessionRestoreFailed(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.authenticated = false;
      state.loading = false;
      state.initialized = true;
      state.status = "unauthenticated";
    },

    logoutCompleted(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.authenticated = false;
      state.loading = false;
      state.initialized = true;
      state.status = "unauthenticated";
      state.error = null;
    },

    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const {
  loginRequest,
  authSuccess,
  authFailure,
  sessionRestoreStarted,
  sessionTokensRestored,
  sessionUserUpdated,
  sessionRestoreFailed,
  logoutCompleted,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
