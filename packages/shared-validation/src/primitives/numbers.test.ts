import { describe, expect, it } from "vitest";
import { nonNegativeIntSchema, positiveIntSchema } from "./numbers";

describe("positiveIntSchema", () => {
  it("accepts positive integers", () => {
    expect(positiveIntSchema.safeParse(1).success).toBe(true);
    expect(positiveIntSchema.safeParse(42).data).toBe(42);
  });

  it("rejects zero", () => {
    expect(positiveIntSchema.safeParse(0).success).toBe(false);
  });

  it("rejects negative numbers", () => {
    expect(positiveIntSchema.safeParse(-1).success).toBe(false);
  });

  it("rejects decimals", () => {
    expect(positiveIntSchema.safeParse(1.5).success).toBe(false);
  });

  it("does not coerce strings", () => {
    expect(positiveIntSchema.safeParse("1").success).toBe(false);
  });
});

describe("nonNegativeIntSchema", () => {
  it("accepts zero and positive integers", () => {
    expect(nonNegativeIntSchema.safeParse(0).success).toBe(true);
    expect(nonNegativeIntSchema.safeParse(3).success).toBe(true);
  });

  it("rejects negative numbers", () => {
    expect(nonNegativeIntSchema.safeParse(-1).success).toBe(false);
  });

  it("rejects decimals", () => {
    expect(nonNegativeIntSchema.safeParse(0.5).success).toBe(false);
  });
});
