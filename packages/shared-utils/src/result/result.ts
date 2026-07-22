import type { Err, Ok, Result } from "@nexus/shared-types";

export function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

export function err<E>(error: E): Err<E> {
  return { ok: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.ok === true;
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result.ok === false;
}

export function unwrap<T, E>(result: Result<T, E>): T {
  if (isOk(result)) {
    return result.value;
  }

  const error = result.error;
  throw error instanceof Error ? error : new Error(String(error));
}

export function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T {
  return isOk(result) ? result.value : fallback;
}

export function mapResult<T, U, E>(
  result: Result<T, E>,
  mapFn: (value: T) => U,
): Result<U, E> {
  if (isOk(result)) {
    return ok(mapFn(result.value));
  }

  return err(result.error);
}

export function mapErr<T, E, F>(
  result: Result<T, E>,
  mapFn: (error: E) => F,
): Result<T, F> {
  if (isOk(result)) {
    return result;
  }

  return err(mapFn(result.error));
}
