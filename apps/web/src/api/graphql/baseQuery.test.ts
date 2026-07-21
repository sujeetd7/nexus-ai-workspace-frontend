import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "../errors";
import { graphqlBaseQuery } from "./baseQuery";
import { graphqlClient } from "./client";

vi.mock("./client", () => ({
  graphqlClient: {
    post: vi.fn(),
  },
}));

describe("graphqlBaseQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("posts the GraphQL request and returns data", async () => {
    const request = {
      query: `
        query GetUser($id: ID!) {
          user(id: $id) {
            id
            email
          }
        }
      `,
      variables: {
        id: "user-1",
      },
    };

    vi.mocked(graphqlClient.post).mockResolvedValue({
      data: {
        data: {
          user: {
            id: "user-1",
            email: "user@nexus.ai",
          },
        },
      },
    });

    const result = await graphqlBaseQuery<{
      user: {
        id: string;
        email: string;
      };
    }>(request);

    expect(graphqlClient.post).toHaveBeenCalledWith("", request, {
      signal: undefined,
    });

    expect(result).toEqual({
      user: {
        id: "user-1",
        email: "user@nexus.ai",
      },
    });
  });

  it("normalizes GraphQL errors[] into ApiError", async () => {
    vi.mocked(graphqlClient.post).mockResolvedValue({
      data: {
        errors: [
          {
            message: "Forbidden",
            extensions: { code: "FORBIDDEN" },
          },
        ],
      },
    });

    await expect(
      graphqlBaseQuery({ query: "{ secret }" }),
    ).rejects.toBeInstanceOf(ApiError);
  });
});
