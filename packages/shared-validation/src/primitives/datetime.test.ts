import { describe, expect, it } from "vitest";
import { isoDateStringSchema, isoDateTimeStringSchema } from "./datetime";

describe("isoDateStringSchema", () => {
  it("accepts valid ISO dates", () => {
    const result = isoDateStringSchema.safeParse("2026-07-22");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("2026-07-22");
    }
  });

  it("trims whitespace", () => {
    const result = isoDateStringSchema.safeParse("  2026-07-22  ");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("2026-07-22");
    }
  });

  it("rejects invalid dates", () => {
    expect(isoDateStringSchema.safeParse("2026-13-01").success).toBe(false);
    expect(isoDateStringSchema.safeParse("2026-02-30").success).toBe(false);
    expect(isoDateStringSchema.safeParse("22-07-2026").success).toBe(false);
  });

  it("rejects whitespace-only", () => {
    expect(isoDateStringSchema.safeParse("   ").success).toBe(false);
  });
});

describe("isoDateTimeStringSchema", () => {
  it("accepts valid ISO date-times with Z", () => {
    const result = isoDateTimeStringSchema.safeParse(
      "2026-07-22T05:30:00.000Z",
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("2026-07-22T05:30:00.000Z");
    }
  });

  it("accepts numeric timezone offsets", () => {
    expect(
      isoDateTimeStringSchema.safeParse("2026-07-22T05:30:00+05:30").success,
    ).toBe(true);
    expect(
      isoDateTimeStringSchema.safeParse("2026-07-22T05:30:00-0800").success,
    ).toBe(true);
  });

  it("rejects missing timezone", () => {
    expect(
      isoDateTimeStringSchema.safeParse("2026-07-22T05:30:00").success,
    ).toBe(false);
  });

  it("rejects partial date-times", () => {
    expect(isoDateTimeStringSchema.safeParse("2026-07-22").success).toBe(
      false,
    );
    expect(isoDateTimeStringSchema.safeParse("2026-07-22T05:30").success).toBe(
      false,
    );
  });

  it("rejects whitespace-only", () => {
    expect(isoDateTimeStringSchema.safeParse("   ").success).toBe(false);
  });
});
