import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";

import { ApiError, normalizeApiError } from "./ApiError";

describe("normalizeApiError", () => {
  it("returns an existing ApiError unchanged", () => {
    const error = new ApiError({
      status: 400,
      code: "BAD_REQUEST",
      message: "Invalid request",
    });

    expect(normalizeApiError(error)).toBe(error);
  });

  it("normalizes a standard Error", () => {
    const normalized = normalizeApiError(new Error("Unexpected failure"));

    expect(normalized).toBeInstanceOf(ApiError);
    expect(normalized.message).toBe("Unexpected failure");
    expect(normalized.status).toBeUndefined();
  });

  it("uses a fallback message for unknown values", () => {
    const normalized = normalizeApiError(null);

    expect(normalized.message).toBe("An unexpected error occurred.");
  });

  it("extracts Axios response details", () => {
    const axiosError = new AxiosError(
      "Request failed",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        status: 401,
        statusText: "Unauthorized",
        config: {
          headers: new AxiosHeaders(),
        },
        headers: new AxiosHeaders({
          "x-request-id": "header-request-id",
        }),
        data: {
          code: "INVALID_CREDENTIALS",
          message: "Email or password is incorrect.",
          requestId: "body-request-id",
        },
      },
    );

    const normalized = normalizeApiError(axiosError);

    expect(normalized.status).toBe(401);
    expect(normalized.code).toBe("INVALID_CREDENTIALS");
    expect(normalized.message).toBe("Email or password is incorrect.");
    expect(normalized.requestId).toBe("body-request-id");
  });

  it("uses the response header request ID when body request ID is absent", () => {
    const axiosError = new AxiosError(
      "Server error",
      "ERR_BAD_RESPONSE",
      undefined,
      undefined,
      {
        status: 500,
        statusText: "Internal Server Error",
        config: {
          headers: new AxiosHeaders(),
        },
        headers: new AxiosHeaders({
          "x-request-id": "header-request-id",
        }),
        data: {
          code: "INTERNAL_ERROR",
          message: "Something went wrong.",
        },
      },
    );

    const normalized = normalizeApiError(axiosError);

    expect(normalized.requestId).toBe("header-request-id");
  });
});
