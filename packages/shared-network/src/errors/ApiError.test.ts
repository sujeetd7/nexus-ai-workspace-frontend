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
});
