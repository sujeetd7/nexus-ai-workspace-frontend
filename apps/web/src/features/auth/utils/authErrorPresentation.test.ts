import { describe, expect, it } from "vitest";

import { classifyAuthError } from "./authErrorPresentation";

describe("classifyAuthError", () => {
  it("classifies network and unauthorized", () => {
    expect(
      classifyAuthError({
        message: "Network Error",
        retryable: true,
        causeType: "network",
      }).kind,
    ).toBe("network");

    expect(
      classifyAuthError({
        message: "Unauthorized",
        retryable: false,
        status: 401,
      }).kind,
    ).toBe("unauthorized");
  });

  it("classifies expired and invalid tokens from code/message", () => {
    expect(
      classifyAuthError({
        message: "Token expired",
        retryable: false,
        code: "TOKEN_EXPIRED",
        status: 400,
      }).kind,
    ).toBe("expiredToken");

    expect(
      classifyAuthError({
        message: "Invalid verification token",
        retryable: false,
        status: 400,
      }).kind,
    ).toBe("invalidToken");
  });
});
