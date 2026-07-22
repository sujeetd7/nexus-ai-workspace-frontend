import { describe, expect, it } from "vitest";
import {
  nonEmptyTrimmedStringSchema,
  optionalTrimmedStringSchema,
} from "./strings";

describe("nonEmptyTrimmedStringSchema", () => {
  it("accepts valid trimmed input", () => {
    expect(nonEmptyTrimmedStringSchema.safeParse("  hello  ").success).toBe(
      true,
    );
    expect(nonEmptyTrimmedStringSchema.safeParse("  hello  ").data).toBe(
      "hello",
    );
  });

  it("rejects empty string", () => {
    expect(nonEmptyTrimmedStringSchema.safeParse("").success).toBe(false);
  });

  it("rejects whitespace-only string", () => {
    expect(nonEmptyTrimmedStringSchema.safeParse("   ").success).toBe(false);
  });
});

describe("optionalTrimmedStringSchema", () => {
  it("accepts undefined", () => {
    const result = optionalTrimmedStringSchema.safeParse(undefined);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBeUndefined();
    }
  });

  it("trims present values", () => {
    const result = optionalTrimmedStringSchema.safeParse("  name  ");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("name");
    }
  });

  it("treats whitespace-only as undefined", () => {
    const result = optionalTrimmedStringSchema.safeParse("   ");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBeUndefined();
    }
  });
});
