import type { AuthClient } from "@nexus/shared-types";
import { describe, expect, it, vi } from "vitest";

import { createSessionManager } from "./createSessionManager";

function createMemoryStorage() {
  let accessToken: string | null = null;
  let refreshToken: string | null = null;

  return {
    async getAccessToken() {
      return accessToken;
    },
    async getRefreshToken() {
      return refreshToken;
    },
    async setTokens(a: string, r: string) {
      accessToken = a;
      refreshToken = r;
    },
    async clearTokens() {
      accessToken = null;
      refreshToken = null;
    },
  };
}

describe("createSessionManager", () => {
  it("deduplicates concurrent refresh attempts", async () => {
    const refresh = vi.fn().mockResolvedValue({
      user: { id: "1", email: "a@b.com" },
      tokens: { accessToken: "new", refreshToken: "new-r" },
    });

    const authClient = {
      refresh,
    } as unknown as AuthClient;

    const storage = createMemoryStorage();
    await storage.setTokens("old", "refresh-1");

    const session = createSessionManager({
      authClient,
      tokenStorage: storage,
    });

    const [a, b] = await Promise.all([
      session.tryRefresh(),
      session.tryRefresh(),
    ]);

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(a).toBe("new");
    expect(b).toBe("new");
  });

  it("clears session when refresh fails", async () => {
    const authClient = {
      refresh: vi.fn().mockRejectedValue(new Error("invalid refresh")),
    } as unknown as AuthClient;

    const storage = createMemoryStorage();
    await storage.setTokens("old", "refresh-1");

    const session = createSessionManager({
      authClient,
      tokenStorage: storage,
    });

    const token = await session.tryRefresh();
    expect(token).toBeNull();
    expect(session.getSnapshot().status).toBe("session-expired");
    expect(await storage.getAccessToken()).toBeNull();
  });
});
