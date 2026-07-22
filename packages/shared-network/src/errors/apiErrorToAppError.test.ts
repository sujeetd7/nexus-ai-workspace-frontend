import { describe, expect, it } from "vitest";

import { ERROR_CODES } from "@nexus/shared-types";

import { ApiError } from "./ApiError";
import { apiErrorToAppError } from "./apiErrorToAppError";

describe("apiErrorToAppError", () => {
  it("maps ApiError to AppError with safe metadata", () => {
    const apiError = new ApiError({
      status: 401,
      code: "INVALID_CREDENTIALS",
      message: "Email or password is incorrect.",
      requestId: "req-1",
      data: { token: "secret", password: "x" },
      cause: { axios: true },
    });

    const appError = apiErrorToAppError(apiError);

    expect(appError).toMatchObject({
      name: "ApiError",
      code: ERROR_CODES.UNAUTHORIZED,
      message: "Email or password is incorrect.",
      retryable: false,
      metadata: {
        status: 401,
        requestId: "req-1",
        networkCode: "INVALID_CREDENTIALS",
      },
    });
    expect(appError.metadata).not.toHaveProperty("token");
    expect(appError.metadata).not.toHaveProperty("password");
    expect(appError.cause).toBe(apiError);
  });

  it("maps timeout and retryable network failures", () => {
    const timeout = apiErrorToAppError(
      new ApiError({
        status: 408,
        message: "Timed out",
        code: "ECONNABORTED",
      }),
    );

    expect(timeout.code).toBe(ERROR_CODES.TIMEOUT);
    expect(timeout.retryable).toBe(true);

    const server = apiErrorToAppError(
      new ApiError({
        status: 503,
        message: "Unavailable",
      }),
    );

    expect(server.code).toBe(ERROR_CODES.INTERNAL);
    expect(server.retryable).toBe(true);
  });
});
