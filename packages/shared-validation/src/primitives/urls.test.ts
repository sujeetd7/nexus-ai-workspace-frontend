import { describe, expect, it } from "vitest";
import {
  absoluteHttpUrlSchema,
  optionalAbsoluteHttpUrlSchema,
} from "./urls";

describe("absoluteHttpUrlSchema", () => {
  it("accepts valid HTTPS URLs", () => {
    const result = absoluteHttpUrlSchema.safeParse("https://example.com/api");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("https://example.com/api");
    }
  });

  it("accepts valid HTTP URLs", () => {
    expect(
      absoluteHttpUrlSchema.safeParse("http://example.com").success,
    ).toBe(true);
  });

  it("accepts localhost", () => {
    expect(
      absoluteHttpUrlSchema.safeParse("http://localhost:3000/api").success,
    ).toBe(true);
  });

  it("trims whitespace", () => {
    const result = absoluteHttpUrlSchema.safeParse(
      "  https://example.com/graphql  ",
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("https://example.com/graphql");
    }
  });

  it("rejects missing scheme", () => {
    expect(absoluteHttpUrlSchema.safeParse("example.com/api").success).toBe(
      false,
    );
  });

  it("rejects relative paths", () => {
    expect(absoluteHttpUrlSchema.safeParse("/graphql").success).toBe(false);
  });

  it("rejects malformed URLs", () => {
    expect(absoluteHttpUrlSchema.safeParse("not a url").success).toBe(false);
  });

  it("rejects unsupported protocols", () => {
    expect(absoluteHttpUrlSchema.safeParse("ftp://example.com").success).toBe(
      false,
    );
  });

  it("rejects empty and whitespace", () => {
    expect(absoluteHttpUrlSchema.safeParse("").success).toBe(false);
    expect(absoluteHttpUrlSchema.safeParse("   ").success).toBe(false);
  });
});

describe("optionalAbsoluteHttpUrlSchema", () => {
  it("accepts undefined", () => {
    const result = optionalAbsoluteHttpUrlSchema.safeParse(undefined);
    expect(result.success).toBe(true);
  });

  it("accepts valid URLs", () => {
    expect(
      optionalAbsoluteHttpUrlSchema.safeParse("https://example.com").success,
    ).toBe(true);
  });

  it("rejects invalid URLs when present", () => {
    expect(optionalAbsoluteHttpUrlSchema.safeParse("/relative").success).toBe(
      false,
    );
  });
});
