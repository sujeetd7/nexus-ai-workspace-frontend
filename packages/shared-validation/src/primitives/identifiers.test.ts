import { describe, expect, it } from "vitest";
import { nonEmptyIdSchema } from "./identifiers";

describe("nonEmptyIdSchema", () => {
  it("accepts valid identifiers", () => {
    expect(nonEmptyIdSchema.safeParse("user-1").success).toBe(true);
    expect(nonEmptyIdSchema.safeParse("  id-abc  ").data).toBe("id-abc");
  });

  it("rejects empty and whitespace", () => {
    expect(nonEmptyIdSchema.safeParse("").success).toBe(false);
    expect(nonEmptyIdSchema.safeParse("   ").success).toBe(false);
  });
});
