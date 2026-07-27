export interface TokenProvider {
  getAccessToken(): string | null | Promise<string | null>;
}

export interface UnauthorizedHandler {
  onUnauthorized(): void | Promise<void>;
}

/** Coordinates access-token refresh and single 401 replay (session-manager owned). */
export interface RefreshHandler {
  /** Returns a new access token or null when session should end. */
  tryRefresh(): string | null | Promise<string | null>;
  /** Skip refresh/replay for auth endpoints (login, refresh, logout). */
  shouldSkipRefresh?(url?: string): boolean;
}

export interface NetworkLogger {
  debug?(message: string, metadata?: unknown): void;
  info?(message: string, metadata?: unknown): void;
  warn?(message: string, metadata?: unknown): void;
  error?(message: string, metadata?: unknown): void;
}
