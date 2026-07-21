import { AxiosError, AxiosHeaders } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { axiosClient } from "../client";
import { axiosBaseQuery } from "./axiosBaseQuery";

vi.mock("../client", () => ({
  axiosClient: vi.fn(),
}));

describe("axiosBaseQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns response data for a successful request", async () => {
    vi.mocked(axiosClient).mockResolvedValue({
      data: {
        id: "user-1",
      },
    });

    const baseQuery = axiosBaseQuery();
    const signal = new AbortController().signal;

    const result = await baseQuery(
      {
        url: "/users/user-1",
        method: "GET",
      },
      { signal } as never,
      {},
    );

    expect(result).toEqual({
      data: {
        id: "user-1",
      },
    });
    expect(axiosClient).toHaveBeenCalledWith({
      url: "/users/user-1",
      method: "GET",
      data: undefined,
      params: undefined,
      headers: undefined,
      signal,
    });
  });

  it("forwards request configuration to Axios", async () => {
    vi.mocked(axiosClient).mockResolvedValue({
      data: {
        success: true,
      },
    });

    const baseQuery = axiosBaseQuery();

    await baseQuery(
      {
        url: "/users",
        method: "POST",
        data: {
          name: "Sujeet",
        },
        params: {
          include: "profile",
        },
        headers: {
          "X-Test-Header": "test-value",
        },
      },
      {} as never,
      {},
    );

    expect(axiosClient).toHaveBeenCalledWith({
      url: "/users",
      method: "POST",
      data: {
        name: "Sujeet",
      },
      params: {
        include: "profile",
      },
      headers: {
        "X-Test-Header": "test-value",
      },
      signal: undefined,
    });
  });

  it("returns a normalized RTK Query error", async () => {
    const axiosError = new AxiosError(
      "Unauthorized",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        status: 401,
        statusText: "Unauthorized",
        config: {
          headers: new AxiosHeaders(),
        },
        headers: new AxiosHeaders(),
        data: {
          code: "INVALID_TOKEN",
          message: "Authentication failed.",
          requestId: "request-123",
        },
      },
    );

    vi.mocked(axiosClient).mockRejectedValue(axiosError);

    const baseQuery = axiosBaseQuery();

    const result = await baseQuery(
      {
        url: "/profile",
      },
      {} as never,
      {},
    );

    expect(result).toEqual({
      error: {
        status: 401,
        code: "INVALID_TOKEN",
        message: "Authentication failed.",
        data: {
          code: "INVALID_TOKEN",
          message: "Authentication failed.",
          requestId: "request-123",
        },
        requestId: "request-123",
      },
    });
  });
});
