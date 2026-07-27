import { describe, expect, it, vi } from "vitest";

import { createWorkspaceClient } from "./createWorkspaceClient";

describe("createWorkspaceClient", () => {
  it("uses Gateway workspace paths", async () => {
    const workspace = {
      id: "ws-1",
      name: "Team",
      slug: "team-abc",
      ownerId: "user-1",
      status: "ACTIVE" as const,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };

    const client = {
      get: vi.fn(async (url: string) => {
        if (url === "/workspaces") {
          return { data: [workspace] };
        }
        expect(url).toBe(`/workspaces/${workspace.id}/members`);
        return { data: [] };
      }),
      post: vi.fn(async (url: string) => {
        expect(url).toBe("/workspaces/invitations/accept");
        return {
          data: {
            id: "inv-1",
            workspaceId: workspace.id,
            email: "user@example.com",
            invitedBy: "owner-1",
            role: "DEVELOPER",
            status: "ACCEPTED",
            token: "token",
            expiresAt: "2026-02-01T00:00:00.000Z",
            createdAt: "2026-01-01T00:00:00.000Z",
          },
        };
      }),
      patch: vi.fn(),
      delete: vi.fn(),
    };

    const workspaceClient = createWorkspaceClient({ client });

    await expect(workspaceClient.listWorkspaces()).resolves.toEqual([workspace]);
    await expect(workspaceClient.listMembers(workspace.id)).resolves.toEqual([]);
    await expect(
      workspaceClient.acceptInvitation({ token: "token" }),
    ).resolves.toMatchObject({ workspaceId: workspace.id });

    expect(client.get).toHaveBeenCalledTimes(2);
    expect(client.post).toHaveBeenCalledOnce();
  });
});
