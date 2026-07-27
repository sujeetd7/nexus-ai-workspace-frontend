import type { RootReducerState } from "../../rootReducer";

export const selectAuth = (state: RootReducerState) => state.auth;
export const selectIsAuthenticated = (state: RootReducerState) =>
  state.auth.authenticated;
export const selectAuthInitialized = (state: RootReducerState) =>
  state.auth.initialized;
export const selectAuthLoading = (state: RootReducerState) => state.auth.loading;
export const selectAuthError = (state: RootReducerState) => state.auth.error;
export const selectUser = (state: RootReducerState) => state.auth.user;
