import type { RootState } from "../../createAppStore";

export const selectAuth = (state: RootState) => state.auth;

export const selectUser = (state: RootState) => state.auth.user;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.authenticated;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

export const selectAuthLoading = (state: RootState) => state.auth.loading;

export const selectAuthInitialized = (state: RootState) =>
  state.auth.initialized;

export const selectAuthError = (state: RootState) => state.auth.error;
