import { describe, expect, it } from "vitest";

import {
  ERROR_CODES,
  type AppError,
  type SerializedAppError,
} from "./index";

describe("@nexus/shared-types error contracts", () => {
  it("exposes stable ERROR_CODES values", () => {
    expect(ERROR_CODES.UNKNOWN).toBe("UNKNOWN");
    expect(ERROR_CODES.VALIDATION).toBe("VALIDATION");
    expect(ERROR_CODES.NETWORK).toBe("NETWORK");
  });

  it("supports extended AppError and SerializedAppError shapes", () => {
    const error: AppError = {
      name: "AppError",
      code: ERROR_CODES.VALIDATION,
      message: "Invalid input",
      retryable: false,
      metadata: { field: "email" },
      cause: new Error("root"),
    };

    const serialized: SerializedAppError = {
      code: ERROR_CODES.VALIDATION,
      message: "Invalid input",
      retryable: false,
      metadata: { field: "email" },
    };

    expect(error.code).toBe("VALIDATION");
    expect(serialized.code).toBe("VALIDATION");
    expect(Object.prototype.hasOwnProperty.call(serialized, "cause")).toBe(
      false,
    );
  });
});
