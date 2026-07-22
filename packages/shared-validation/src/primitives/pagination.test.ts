import { describe, expect, it } from "vitest";
import {
  cursorPageRequestSchema,
  pageRequestSchema,
} from "./pagination";
import { buildModeSchema } from "./enums";

describe("pageRequestSchema", () => {
  it("accepts valid page requests", () => {
    const result = pageRequestSchema.safeParse({ page: 1, pageSize: 20 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ page: 1, pageSize: 20 });
    }
  });

  it("rejects zero and negative page values", () => {
    expect(pageRequestSchema.safeParse({ page: 0, pageSize: 20 }).success).toBe(
      false,
    );
    expect(
      pageRequestSchema.safeParse({ page: 1, pageSize: -1 }).success,
    ).toBe(false);
  });

  it("rejects decimals", () => {
    expect(
      pageRequestSchema.safeParse({ page: 1.5, pageSize: 20 }).success,
    ).toBe(false);
  });

  it("rejects unknown keys", () => {
    expect(
      pageRequestSchema.safeParse({
        page: 1,
        pageSize: 20,
        extra: true,
      }).success,
    ).toBe(false);
  });

  it("does not coerce string numbers", () => {
    expect(
      pageRequestSchema.safeParse({ page: "1", pageSize: "20" }).success,
    ).toBe(false);
  });
});

describe("cursorPageRequestSchema", () => {
  it("accepts limit-only requests", () => {
    const result = cursorPageRequestSchema.safeParse({ limit: 10 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ limit: 10 });
    }
  });

  it("accepts cursor and limit", () => {
    const result = cursorPageRequestSchema.safeParse({
      cursor: "  next-token  ",
      limit: 10,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ cursor: "next-token", limit: 10 });
    }
  });

  it("rejects empty cursor when present", () => {
    expect(
      cursorPageRequestSchema.safeParse({ cursor: "   ", limit: 10 }).success,
    ).toBe(false);
  });

  it("rejects non-positive limit", () => {
    expect(cursorPageRequestSchema.safeParse({ limit: 0 }).success).toBe(
      false,
    );
  });

  it("rejects unknown keys", () => {
    expect(
      cursorPageRequestSchema.safeParse({ limit: 10, offset: 0 }).success,
    ).toBe(false);
  });
});

describe("buildModeSchema", () => {
  it("accepts supported build modes", () => {
    expect(buildModeSchema.safeParse("development").success).toBe(true);
    expect(buildModeSchema.safeParse("test").success).toBe(true);
    expect(buildModeSchema.safeParse("production").success).toBe(true);
  });

  it("rejects unsupported values", () => {
    expect(buildModeSchema.safeParse("staging").success).toBe(false);
  });
});
