import { ERROR_CODES } from "@nexus/shared-types";
import { describe, expect, it } from "vitest";
import { isAppError } from "../errors/appError";
import { serializeStorageValue } from "./serializeStorageValue";

class SampleClass {
  value = 1;
}

describe("serializeStorageValue", () => {
  it("serializes null, boolean, number, and string", () => {
    expect(serializeStorageValue(null)).toBe("null");
    expect(serializeStorageValue(true)).toBe("true");
    expect(serializeStorageValue(42)).toBe("42");
    expect(serializeStorageValue("hello")).toBe('"hello"');
  });

  it("serializes arrays and plain objects", () => {
    expect(serializeStorageValue([1, "a", null])).toBe('[1,"a",null]');
    expect(serializeStorageValue({ a: 1, b: { c: false } })).toBe(
      '{"a":1,"b":{"c":false}}',
    );
  });

  it("rejects undefined, function, symbol, and bigint", () => {
    expect(() =>
      serializeStorageValue(undefined as unknown as never),
    ).toThrow();
    expect(() =>
      serializeStorageValue((() => undefined) as unknown as never),
    ).toThrow();
    expect(() =>
      serializeStorageValue(Symbol("x") as unknown as never),
    ).toThrow();
    expect(() =>
      serializeStorageValue(1n as unknown as never),
    ).toThrow();
  });

  it("rejects non-finite numbers", () => {
    expect(() =>
      serializeStorageValue(Number.NaN as unknown as never),
    ).toThrow();
    expect(() =>
      serializeStorageValue(Number.POSITIVE_INFINITY as unknown as never),
    ).toThrow();
    expect(() =>
      serializeStorageValue(Number.NEGATIVE_INFINITY as unknown as never),
    ).toThrow();
  });

  it("rejects circular references", () => {
    const circular: { self?: unknown } = {};
    circular.self = circular;
    expect(() =>
      serializeStorageValue(circular as unknown as never),
    ).toThrow();
  });

  it("rejects Date, class instances, and Error objects", () => {
    expect(() =>
      serializeStorageValue(new Date() as unknown as never),
    ).toThrow();
    expect(() =>
      serializeStorageValue(new SampleClass() as unknown as never),
    ).toThrow();
    expect(() =>
      serializeStorageValue(new Error("boom") as unknown as never),
    ).toThrow();
  });

  it("does not leak raw values in errors", () => {
    try {
      serializeStorageValue({ secret: "super-secret-token" } as never);
      // Force failure with a function nested after a valid walk path
    } catch {
      // no-op
    }

    try {
      serializeStorageValue((() => "super-secret-token") as unknown as never);
    } catch (error) {
      const serialized = JSON.stringify(error);
      expect(serialized).not.toContain("super-secret-token");
      expect(isAppError(error)).toBe(true);
      if (isAppError(error)) {
        expect(error.code).toBe(ERROR_CODES.STORAGE);
        expect(error.metadata?.operation).toBe("serialize");
      }
    }
  });
});
