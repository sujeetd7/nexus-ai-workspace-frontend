import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "../../../api/auth";
import type { AuthResponse } from "../types";

export interface PersistedSession {
  accessToken: string;
  refreshToken: string;
}

export function persistAuthSession(response: AuthResponse): void {
  setTokens(response.tokens.accessToken, response.tokens.refreshToken);
}

export function readPersistedSession(): PersistedSession | null {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
  };
}

export function clearAuthSession(): void {
  clearTokens();
}
