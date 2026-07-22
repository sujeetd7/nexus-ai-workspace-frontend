import {
  ERROR_CODES,
  type AppError,
  type ErrorCode,
  type Result,
} from "@nexus/shared-types";
import type { z } from "zod";
import { err, ok } from "./result";
import { zodErrorToAppError } from "./zodErrorMapping";

export interface ParseWithSchemaOptions {
  /**
   * Defaults to `ERROR_CODES.VALIDATION`.
   * Use `ERROR_CODES.CONFIGURATION` for environment/config boundaries.
   */
  readonly errorCode?: ErrorCode;
  /** Defaults to `"Validation failed."` */
  readonly message?: string;
  /** Fallback metadata field when Zod path is empty. Defaults to `"input"`. */
  readonly fallbackField?: string;
}

/**
 * Safe-parse unknown input with a Zod schema and return `Result<T, AppError>`.
 * Does not alter schema-defined unknown-key policy.
 */
export function parseWithSchema<T>(
  schema: z.ZodType<T>,
  input: unknown,
  options: ParseWithSchemaOptions = {},
): Result<T, AppError> {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    return err(
      zodErrorToAppError(parsed.error, {
        errorCode: options.errorCode ?? ERROR_CODES.VALIDATION,
        message: options.message ?? "Validation failed.",
        fallbackField: options.fallbackField,
      }),
    );
  }

  return ok(parsed.data);
}
