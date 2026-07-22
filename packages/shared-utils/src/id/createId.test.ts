import { describe, expect, it } from "vitest";

import { createId } from "./createId";

describe("createId", () => {
  it("creates a prefixed unique-looking id", () => {
    const id = createId("user");

    expect(id.startsWith("user-")).toBe(true);
    expect(id.split("-").length).toBeGreaterThanOrEqual(3);
  });

  it("defaults the prefix to id", () => {
    expect(createId().startsWith("id-")).toBe(true);
  });

  it("increments sequence within the process", () => {
    const first = createId("seq");
    const second = createId("seq");

    expect(first).not.toBe(second);
  });
});
