import type { Err, Ok, Result } from "@nexus/shared-types";

export function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

export function err<E>(error: E): Err<E> {
  return { ok: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.ok;
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return !result.ok;
}

export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.ok) {
    return result.value;
  }

  throw result.error instanceof Error
    ? result.error
    : new Error(String(result.error));
}

export function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T {
  return result.ok ? result.value : fallback;
}

export function mapResult<T, U, E>(
  result: Result<T, E>,
  mapFn: (value: T) => U,
): Result<U, E> {
  return result.ok ? ok(mapFn(result.value)) : result;
}

export function mapErr<T, E, F>(
  result: Result<T, E>,
  mapFn: (error: E) => F,
): Result<T, F> {
  return result.ok ? result : err(mapFn(result.error));
}
