/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it } from "vitest";

import { createWebSelectedWorkspaceStorage } from "./createWebSelectedWorkspaceStorage";

describe("createWebSelectedWorkspaceStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("persists and clears selected workspace id", async () => {
    const storage = createWebSelectedWorkspaceStorage();
    expect(await storage.getSelectedWorkspaceId()).toBeNull();

    await storage.setSelectedWorkspaceId("ws-1");
    expect(await storage.getSelectedWorkspaceId()).toBe("ws-1");

    await storage.clearSelectedWorkspaceId();
    expect(await storage.getSelectedWorkspaceId()).toBeNull();
  });
});
