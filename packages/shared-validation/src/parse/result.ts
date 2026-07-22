import type { AppError, Result } from "@nexus/shared-types";

export function ok<T>(value: T): Result<T, AppError> {
  return { ok: true, value };
}

export function err<T = never>(error: AppError): Result<T, AppError> {
  return { ok: false, error };
}
