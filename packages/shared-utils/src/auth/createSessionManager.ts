import type {
  AuthClient,
  AuthResponse,
  AuthSessionStatus,
  AuthUser,
  Logger,
} from "@nexus/shared-types";

export interface TokenStorageAdapter {
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  setTokens(accessToken: string, refreshToken: string): Promise<void>;
  clearTokens(): Promise<void>;
}

export interface SessionSnapshot {
  readonly status: AuthSessionStatus;
  readonly user: AuthUser | null;
  readonly accessToken: string | null;
  readonly refreshToken: string | null;
}

/** Coordinates access-token refresh for HTTP replay (session-manager owned). */
export interface SessionRefreshHandler {
  tryRefresh(): string | null | Promise<string | null>;
  shouldSkipRefresh?(url?: string): boolean;
}

export interface SessionManager extends SessionRefreshHandler {
  bootstrap(signal?: AbortSignal): Promise<SessionSnapshot>;
  login(
    email: string,
    password: string,
    signal?: AbortSignal
  ): Promise<SessionSnapshot>;
  register(
    input: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    },
    signal?: AbortSignal
  ): Promise<SessionSnapshot>;
  logout(signal?: AbortSignal): Promise<void>;
  logoutAll(signal?: AbortSignal): Promise<void>;
  getSnapshot(): SessionSnapshot;
  subscribe(listener: (snapshot: SessionSnapshot) => void): () => void;
  getAccessToken(): Promise<string | null>;
  createRequestSignal(): AbortSignal;
  cancelInFlightRequests(): void;
}

export interface CreateSessionManagerOptions {
  readonly authClient: AuthClient;
  readonly tokenStorage: TokenStorageAdapter;
  readonly logger?: Logger;
}

function createInitialSnapshot(): SessionSnapshot {
  return {
    status: "bootstrapping",
    user: null,
    accessToken: null,
    refreshToken: null,
  };
}

export function createSessionManager(
  options: CreateSessionManagerOptions
): SessionManager {
  const { authClient, tokenStorage, logger } = options;

  let snapshot = createInitialSnapshot();
  let refreshPromise: Promise<string | null> | null = null;
  let sessionExpiredNotified = false;
  const listeners = new Set<(snapshot: SessionSnapshot) => void>();
  const requestControllers = new Set<AbortController>();

  const cancelInFlightRequests = (): void => {
    for (const controller of requestControllers) {
      controller.abort();
    }
    requestControllers.clear();
  };

  const notify = (): void => {
    for (const listener of listeners) {
      listener(snapshot);
    }
  };

  const setSnapshot = (next: SessionSnapshot): void => {
    snapshot = next;
    notify();
  };

  const applyAuthResponse = async (response: AuthResponse): Promise<void> => {
    await tokenStorage.setTokens(
      response.tokens.accessToken,
      response.tokens.refreshToken
    );
    setSnapshot({
      status: "authenticated",
      user: response.user,
      accessToken: response.tokens.accessToken,
      refreshToken: response.tokens.refreshToken,
    });
    sessionExpiredNotified = false;
  };

  const clearSession = async (
    status: AuthSessionStatus = "unauthenticated"
  ): Promise<void> => {
    cancelInFlightRequests();
    await tokenStorage.clearTokens();
    setSnapshot({
      status,
      user: null,
      accessToken: null,
      refreshToken: null,
    });
  };

  const notifySessionExpiredOnce = (): void => {
    if (sessionExpiredNotified) {
      return;
    }
    sessionExpiredNotified = true;
    logger?.warn("Session expired", { code: "SESSION_EXPIRED" });
  };

  const tryRefresh = async (): Promise<string | null> => {
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) {
        notifySessionExpiredOnce();
        await clearSession("session-expired");
        return null;
      }

      try {
        const response = await authClient.refresh({ refreshToken });
        await applyAuthResponse(response);
        return response.tokens.accessToken;
      } catch (error) {
        logger?.warn("Refresh failed", {
          code: "REFRESH_FAILED",
          message: error instanceof Error ? error.message : "unknown",
        });
        notifySessionExpiredOnce();
        await clearSession("session-expired");
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  };

  return {
    shouldSkipRefresh(url) {
      if (!url) {
        return false;
      }
      return [
        "/auth/login",
        "/auth/register",
        "/auth/refresh",
        "/auth/logout",
      ].some((path) => url.includes(path));
    },

    tryRefresh,

    async bootstrap(signal) {
      setSnapshot({ ...snapshot, status: "bootstrapping" });

      const accessToken = await tokenStorage.getAccessToken();
      const refreshToken = await tokenStorage.getRefreshToken();

      if (!accessToken || !refreshToken) {
        setSnapshot({
          status: "unauthenticated",
          user: null,
          accessToken: null,
          refreshToken: null,
        });
        return snapshot;
      }

      try {
        const response = await authClient.refresh({ refreshToken }, signal);
        await applyAuthResponse(response);
      } catch {
        await clearSession("unauthenticated");
      }

      return snapshot;
    },

    async login(email, password, signal) {
      const response = await authClient.login({ email, password }, signal);
      await applyAuthResponse(response);
      return snapshot;
    },

    async register(input, signal) {
      const response = await authClient.register(input, signal);
      await applyAuthResponse(response);
      return snapshot;
    },

    async logout(signal) {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (refreshToken) {
        try {
          await authClient.logout({ refreshToken }, signal);
        } catch (error) {
          logger?.warn("Logout request failed", {
            code: "LOGOUT_FAILED",
            message: error instanceof Error ? error.message : "unknown",
          });
        }
      }
      await clearSession("unauthenticated");
    },

    async logoutAll(signal) {
      try {
        await authClient.logoutAll(signal);
      } catch (error) {
        logger?.warn("Logout-all request failed", {
          code: "LOGOUT_ALL_FAILED",
          message: error instanceof Error ? error.message : "unknown",
        });
      }
      await clearSession("unauthenticated");
    },

    getSnapshot() {
      return snapshot;
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    async getAccessToken() {
      return (await tokenStorage.getAccessToken()) ?? snapshot.accessToken;
    },

    createRequestSignal() {
      const controller = new AbortController();
      requestControllers.add(controller);
      controller.signal.addEventListener(
        "abort",
        () => {
          requestControllers.delete(controller);
        },
        { once: true }
      );
      return controller.signal;
    },

    cancelInFlightRequests,
  };
}
