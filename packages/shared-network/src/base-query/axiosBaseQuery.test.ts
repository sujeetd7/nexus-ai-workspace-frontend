import type { AxiosInstance } from "axios";
import { describe, expect, it, vi } from "vitest";

import { createAxiosBaseQuery } from "./axiosBaseQuery";

describe("createAxiosBaseQuery", () => {
  it("returns response data and forwards AbortSignal", async () => {
    const client = vi.fn().mockResolvedValue({ data: { id: "1" } });
    const signal = new AbortController().signal;
    const baseQuery = createAxiosBaseQuery(client as unknown as AxiosInstance);

    const result = await baseQuery(
      {
        url: "/users/1",
        method: "GET",
        signal,
      },
      {} as never,
      {},
    );

    expect(result).toEqual({ data: { id: "1" } });
    expect(client).toHaveBeenCalledWith({
      url: "/users/1",
      method: "GET",
      data: undefined,
      params: undefined,
      headers: undefined,
      signal,
    });
  });

  it("returns a normalized RTK Query error", async () => {
    const { ApiError } = await import("../errors");
    const client = vi.fn().mockRejectedValue(
      new ApiError({
        status: 500,
        code: "SERVER_ERROR",
        message: "Boom",
        requestId: "req-1",
      }),
    );

    const baseQuery = createAxiosBaseQuery(client as unknown as AxiosInstance);
    const result = await baseQuery({ url: "/fail" }, {} as never, {});

    expect(result).toEqual({
      error: {
        status: 500,
        code: "SERVER_ERROR",
        message: "Boom",
        data: undefined,
        requestId: "req-1",
      },
    });
  });
});
