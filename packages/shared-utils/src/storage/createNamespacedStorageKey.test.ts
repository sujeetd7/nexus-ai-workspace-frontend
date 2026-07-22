import { ERROR_CODES } from "@nexus/shared-types";
import { describe, expect, it } from "vitest";
import { isAppError } from "../errors/appError";
import { createNamespacedStorageKey } from "./createNamespacedStorageKey";

describe("createNamespacedStorageKey", () => {
  it("builds a deterministic namespaced key", () => {
    expect(createNamespacedStorageKey("prefs", "theme")).toBe(
      "nexus:prefs:theme",
    );
    expect(createNamespacedStorageKey("prefs", "theme")).toBe(
      createNamespacedStorageKey("prefs", "theme"),
    );
  });

  it("trims scope and key", () => {
    expect(createNamespacedStorageKey("  prefs  ", "  theme  ")).toBe(
      "nexus:prefs:theme",
    );
  });

  it("rejects empty and whitespace-only scope", () => {
    expect(() => createNamespacedStorageKey("", "theme")).toThrow();
    expect(() => createNamespacedStorageKey("   ", "theme")).toThrow();

    try {
      createNamespacedStorageKey("", "theme");
    } catch (error) {
      expect(isAppError(error)).toBe(true);
      if (isAppError(error)) {
        expect(error.code).toBe(ERROR_CODES.STORAGE);
        expect(error.metadata?.failure).toBe("invalid_scope");
      }
    }
  });

  it("rejects empty and whitespace-only key", () => {
    expect(() => createNamespacedStorageKey("prefs", "")).toThrow();
    expect(() => createNamespacedStorageKey("prefs", "   ")).toThrow();
  });

  it("rejects control characters", () => {
    expect(() => createNamespacedStorageKey("pre\nfs", "theme")).toThrow();
    expect(() => createNamespacedStorageKey("prefs", "the\u0000me")).toThrow();
  });

  it("rejects embedded separators", () => {
    expect(() => createNamespacedStorageKey("pre:fs", "theme")).toThrow();
    expect(() => createNamespacedStorageKey("prefs", "the:me")).toThrow();
  });

  it("does not leak raw sensitive key content in errors", () => {
    try {
      createNamespacedStorageKey("auth", "refresh-secret-value:");
    } catch (error) {
      const serialized = JSON.stringify(error);
      expect(serialized).not.toContain("refresh-secret-value");
      expect(isAppError(error)).toBe(true);
      if (isAppError(error)) {
        expect(error.code).toBe(ERROR_CODES.STORAGE);
      }
    }
  });
});
