import { describe, expect, it } from "vitest";
import { createMemoryStorageAdapter } from "./createMemoryStorageAdapter";
import { runStorageAdapterContract } from "./storageAdapterContract";

describe("createMemoryStorageAdapter", () => {
  runStorageAdapterContract(() => createMemoryStorageAdapter());

  it("isolates state between instances", async () => {
    const first = createMemoryStorageAdapter();
    const second = createMemoryStorageAdapter();

    await first.setItem("shared", "one");
    expect(await second.getItem("shared")).toBeNull();
  });

  it("is not a durable/global singleton", async () => {
    const adapter = createMemoryStorageAdapter();
    await adapter.setItem("temp", "value");
    const next = createMemoryStorageAdapter();
    expect(await next.getItem("temp")).toBeNull();
  });
});
