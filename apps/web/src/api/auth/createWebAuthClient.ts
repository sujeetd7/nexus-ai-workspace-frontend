import type {
  AuthClient,
  AuthResponse,
  AuthSessionInfo,
  CreateAuthClientOptions,
  MessageResponse,
} from "@nexus/shared-types";

function mapAuthResponse(data: {
  user: AuthResponse["user"];
  tokens?: AuthResponse["tokens"];
  accessToken?: string;
  refreshToken?: string;
}): AuthResponse {
  if (data.tokens) {
    return {
      user: data.user,
      tokens: data.tokens,
    };
  }

  return {
    user: data.user,
    tokens: {
      accessToken: data.accessToken ?? "",
      refreshToken: data.refreshToken ?? "",
    },
  };
}

export function createWebAuthClient(
  options: CreateAuthClientOptions
): AuthClient {
  const { client } = options;

  return {
    async register(input, signal) {
      const { data } = await client.post<{
        user: AuthResponse["user"];
        tokens?: AuthResponse["tokens"];
        accessToken?: string;
        refreshToken?: string;
      }>("/auth/register", input, { signal });
      return mapAuthResponse(data);
    },

    async login(input, signal) {
      const { data } = await client.post<{
        user: AuthResponse["user"];
        tokens?: AuthResponse["tokens"];
        accessToken?: string;
        refreshToken?: string;
      }>("/auth/login", input, { signal });
      return mapAuthResponse(data);
    },

    async refresh(input, signal) {
      const { data } = await client.post<{
        user: AuthResponse["user"];
        tokens?: AuthResponse["tokens"];
        accessToken?: string;
        refreshToken?: string;
      }>("/auth/refresh", input, { signal });
      return mapAuthResponse(data);
    },

    async logout(input, signal) {
      await client.post("/auth/logout", input, { signal });
    },

    async logoutAll(signal) {
      await client.delete("/auth/sessions", { signal });
    },

    async listSessions(signal) {
      const { data } = await client.get<{ sessions: AuthSessionInfo[] }>(
        "/auth/sessions",
        { signal }
      );
      return data.sessions ?? (data as unknown as AuthSessionInfo[]);
    },

    async revokeSession(sessionId, signal) {
      await client.delete(`/auth/sessions/${sessionId}`, { signal });
    },

    async verifyEmail(input, signal) {
      const { data } = await client.post<{
        user: AuthResponse["user"];
        tokens?: AuthResponse["tokens"];
        accessToken?: string;
        refreshToken?: string;
      }>("/auth/verify-email", input, {
        signal,
      });
      return mapAuthResponse(data);
    },

    async resendVerification(input, signal) {
      const { data } = await client.post<MessageResponse>(
        "/auth/resend-verification",
        input,
        {
          signal,
        }
      );
      return data;
    },

    async forgotPassword(input, signal) {
      const { data } = await client.post<MessageResponse>(
        "/auth/forgot-password",
        input,
        {
          signal,
        }
      );
      return data;
    },

    async resetPassword(input, signal) {
      const { data } = await client.post<MessageResponse>(
        "/auth/reset-password",
        input,
        {
          signal,
        }
      );
      return data;
    },
  };
}

let webAuthClient: AuthClient | null = null;

export function getWebAuthClient(): AuthClient {
  if (!webAuthClient) {
    throw new Error("Web auth client has not been initialized.");
  }
  return webAuthClient;
}

export function setWebAuthClient(client: AuthClient): AuthClient {
  webAuthClient = client;
  return webAuthClient;
}

export function resetWebAuthClientForTests(): void {
  webAuthClient = null;
}
