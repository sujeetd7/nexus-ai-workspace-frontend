import type { StorageAdapter } from "@nexus/shared-types";
import { expect, it } from "vitest";

/**
 * Shared StorageAdapter behavior suite. Supports sync and async (MaybePromise).
 */
export function runStorageAdapterContract(
  createAdapter: () => StorageAdapter,
): void {
  it("returns null for a missing key", async () => {
    const adapter = createAdapter();
    expect(await adapter.getItem("missing")).toBeNull();
  });

  it("sets and gets a value", async () => {
    const adapter = createAdapter();
    await adapter.setItem("alpha", "one");
    expect(await adapter.getItem("alpha")).toBe("one");
  });

  it("overwrites an existing value", async () => {
    const adapter = createAdapter();
    await adapter.setItem("alpha", "one");
    await adapter.setItem("alpha", "two");
    expect(await adapter.getItem("alpha")).toBe("two");
  });

  it("stores an empty string", async () => {
    const adapter = createAdapter();
    await adapter.setItem("empty", "");
    expect(await adapter.getItem("empty")).toBe("");
  });

  it("removes an existing key", async () => {
    const adapter = createAdapter();
    await adapter.setItem("alpha", "one");
    await adapter.removeItem("alpha");
    expect(await adapter.getItem("alpha")).toBeNull();
  });

  it("removeItem is idempotent for missing keys", async () => {
    const adapter = createAdapter();
    await adapter.removeItem("missing");
    expect(await adapter.getItem("missing")).toBeNull();
  });

  it("clears all keys when clear is supported", async () => {
    const adapter = createAdapter();
    await adapter.setItem("a", "1");
    await adapter.setItem("b", "2");

    expect(typeof adapter.clear).toBe("function");
    await adapter.clear?.();

    expect(await adapter.getItem("a")).toBeNull();
    expect(await adapter.getItem("b")).toBeNull();
  });

  it("supports multiple independent keys", async () => {
    const adapter = createAdapter();
    await adapter.setItem("a", "1");
    await adapter.setItem("b", "2");
    expect(await adapter.getItem("a")).toBe("1");
    expect(await adapter.getItem("b")).toBe("2");
  });
}
