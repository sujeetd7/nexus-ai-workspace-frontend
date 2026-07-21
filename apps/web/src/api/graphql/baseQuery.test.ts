import { beforeEach, describe, expect, it, vi } from "vitest";

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

  it("posts the GraphQL request and returns its response", async () => {
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

    expect(graphqlClient.post).toHaveBeenCalledWith("", request);

    expect(result).toEqual({
      data: {
        user: {
          id: "user-1",
          email: "user@nexus.ai",
        },
      },
    });
  });
});
