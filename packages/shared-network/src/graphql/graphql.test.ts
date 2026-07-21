import type { AxiosInstance } from "axios";
import { describe, expect, it, vi } from "vitest";

import { ApiError } from "../errors";
import { createGraphQLBaseQuery } from "./graphql";

describe("createGraphQLBaseQuery", () => {
  it("returns GraphQL data on success", async () => {
    const post = vi.fn().mockResolvedValue({
      data: {
        data: {
          user: { id: "1" },
        },
      },
    });

    const run = createGraphQLBaseQuery({ post } as unknown as AxiosInstance);
    const result = await run<{ user: { id: string } }>({
      query: "{ user { id } }",
    });

    expect(result).toEqual({ user: { id: "1" } });
    expect(post).toHaveBeenCalledWith(
      "",
      { query: "{ user { id } }" },
      { signal: undefined },
    );
  });

  it("normalizes GraphQL errors[] into ApiError", async () => {
    const post = vi.fn().mockResolvedValue({
      data: {
        errors: [
          {
            message: "Not found",
            extensions: { code: "NOT_FOUND" },
          },
        ],
      },
    });

    const run = createGraphQLBaseQuery({ post } as unknown as AxiosInstance);

    await expect(run({ query: "{ missing }" })).rejects.toEqual(
      expect.objectContaining({
        name: "ApiError",
        message: "Not found",
        code: "NOT_FOUND",
      }),
    );
    await expect(run({ query: "{ missing }" })).rejects.toBeInstanceOf(ApiError);
  });

  it("fails closed on GraphQL partial data by default", async () => {
    const post = vi.fn().mockResolvedValue({
      data: {
        data: { user: { id: "1" } },
        errors: [{ message: "field error" }],
      },
    });

    const run = createGraphQLBaseQuery({ post } as unknown as AxiosInstance);

    await expect(run({ query: "{ user { id } }" })).rejects.toBeInstanceOf(
      ApiError,
    );
  });

  it("can opt into GraphQL partial data", async () => {
    const post = vi.fn().mockResolvedValue({
      data: {
        data: { user: { id: "1" } },
        errors: [{ message: "field error" }],
      },
    });

    const run = createGraphQLBaseQuery(
      { post } as unknown as AxiosInstance,
      { allowPartialData: true },
    );

    await expect(run({ query: "{ user { id } }" })).resolves.toEqual({
      user: { id: "1" },
    });
  });
});
