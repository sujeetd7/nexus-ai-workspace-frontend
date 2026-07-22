import { ERROR_CODES } from "@nexus/shared-types";
import { describe, expect, it } from "vitest";
import { isAppError } from "../errors/appError";
import { parseStorageValue } from "./parseStorageValue";

describe("parseStorageValue", () => {
  it("parses primitives, arrays, and objects", () => {
    expect(parseStorageValue("null")).toBeNull();
    expect(parseStorageValue("true")).toBe(true);
    expect(parseStorageValue("42")).toBe(42);
    expect(parseStorageValue('"hello"')).toBe("hello");
    expect(parseStorageValue("[1,2]")).toEqual([1, 2]);
    expect(parseStorageValue('{"a":1}')).toEqual({ a: 1 });
  });

  it("rejects malformed JSON", () => {
    expect(() => parseStorageValue("{")).toThrow();
    expect(() => parseStorageValue("not-json")).toThrow();
  });

  it("rejects empty and whitespace-only input", () => {
    expect(() => parseStorageValue("")).toThrow();
    expect(() => parseStorageValue("   ")).toThrow();
  });

  it("does not leak raw input in errors", () => {
    try {
      parseStorageValue('{"token":"super-secret-token"}');
      parseStorageValue("{super-secret-token");
    } catch (error) {
      const serialized = JSON.stringify(error);
      expect(serialized).not.toContain("super-secret-token");
      expect(isAppError(error)).toBe(true);
      if (isAppError(error)) {
        expect(error.code).toBe(ERROR_CODES.STORAGE);
        expect(error.metadata?.operation).toBe("parse");
      }
    }
  });
});
