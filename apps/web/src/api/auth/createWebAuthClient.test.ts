import { describe, expect, it, vi } from "vitest";

import { createWebAuthClient } from "./createWebAuthClient";

describe("createWebAuthClient", () => {
  it("calls Gateway auth login path", async () => {
    const post = vi.fn().mockResolvedValue({
      data: {
        user: { id: "1", email: "a@b.com" },
        tokens: { accessToken: "a", refreshToken: "r" },
      },
    });

    const client = createWebAuthClient({
      client: { post } as never,
    });

    const result = await client.login({
      email: "a@b.com",
      password: "secret123",
    });

    expect(post).toHaveBeenCalledWith(
      "/auth/login",
      { email: "a@b.com", password: "secret123" },
      { signal: undefined }
    );
    expect(result.tokens.accessToken).toBe("a");
  });

  it("maps flat token response shape", async () => {
    const post = vi.fn().mockResolvedValue({
      data: {
        user: { id: "1", email: "a@b.com" },
        accessToken: "a",
        refreshToken: "r",
      },
    });

    const client = createWebAuthClient({
      client: { post } as never,
    });

    const result = await client.refresh({ refreshToken: "r" });
    expect(result.tokens.refreshToken).toBe("r");
  });
});
