import { describe, expect, it, vi } from "vitest";

import { createUserClient } from "./createUserClient";

describe("createUserClient", () => {
  it("calls Gateway paths for current user operations", async () => {
    const profile = {
      id: "profile-1",
      authUserId: "auth-1",
      email: "user@example.com",
      status: "ACTIVE" as const,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };

    const client = {
      get: vi.fn(async (url: string) => {
        expect(url).toBe("/users/me");
        return { data: profile };
      }),
      post: vi.fn(),
      patch: vi.fn(async (url: string, body: unknown) => {
        expect(url).toBe("/users/me");
        expect(body).toEqual({ firstName: "Jane" });
        return { data: { ...profile, firstName: "Jane" } };
      }),
      delete: vi.fn(),
    };

    const userClient = createUserClient({ client });

    await expect(userClient.getCurrentUser()).resolves.toEqual(profile);
    await expect(
      userClient.updateCurrentUser({ firstName: "Jane" }),
    ).resolves.toMatchObject({ firstName: "Jane" });

    expect(client.get).toHaveBeenCalledOnce();
    expect(client.patch).toHaveBeenCalledOnce();
  });

  it("supports cancellation via AbortSignal", async () => {
    const signal = new AbortController().signal;
    const client = {
      get: vi.fn(async (_url: string, config?: { signal?: AbortSignal }) => {
        expect(config?.signal).toBe(signal);
        return { data: {} };
      }),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };

    const userClient = createUserClient({ client });
    await userClient.getCurrentUser(signal);

    expect(client.get).toHaveBeenCalledOnce();
  });
});
