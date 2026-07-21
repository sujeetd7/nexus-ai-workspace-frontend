import type { RootState } from "../../configureStore";

export const selectAuth = (state: RootState) => state.auth;

export const selectUser = (state: RootState) => state.auth.user;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.authenticated;

export const selectAccessToken = (state: RootState) => state.auth.token;
