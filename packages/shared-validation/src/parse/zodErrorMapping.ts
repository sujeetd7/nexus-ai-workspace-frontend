import { ERROR_CODES, type AppError, type ErrorCode } from "@nexus/shared-types";
import type { z } from "zod";

function issueCategory(code: string): string {
  switch (code) {
    case "invalid_type":
      return "invalid_type";
    case "too_small":
      return "empty";
    case "invalid_format":
      return "invalid_format";
    case "custom":
      return "invalid";
    case "invalid_value":
    case "invalid_enum_value":
      return "unsupported_value";
    case "unrecognized_keys":
      return "unknown_field";
    default:
      return "invalid";
  }
}

export interface ZodToAppErrorOptions {
  readonly errorCode?: ErrorCode;
  readonly message?: string;
  readonly fallbackField?: string;
}

/**
 * Maps a Zod failure to a sanitized AppError.
 * Metadata includes field path heads, safe categories, and issue count only.
 * Never includes raw input, field values, URLs, tokens, stacks, or ZodIssue objects.
 */
export function zodErrorToAppError(
  zodError: z.ZodError,
  options: ZodToAppErrorOptions = {},
): AppError {
  const fields = new Set<string>();
  const categories = new Set<string>();
  const fallbackField = options.fallbackField ?? "input";

  for (const issue of zodError.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && field.length > 0) {
      fields.add(field);
    } else if (typeof field === "number") {
      fields.add(String(field));
    } else {
      fields.add(fallbackField);
    }
    categories.add(issueCategory(issue.code));
  }

  return {
    code: options.errorCode ?? ERROR_CODES.VALIDATION,
    message: options.message ?? "Validation failed.",
    retryable: false,
    metadata: {
      fields: [...fields].sort().join(","),
      categories: [...categories].sort().join(","),
      issueCount: zodError.issues.length,
    },
  };
}
