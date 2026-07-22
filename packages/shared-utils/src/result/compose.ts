import type { AppError, Result } from "@nexus/shared-types";

import { normalizeError } from "../errors";
import { err, ok } from "./result";

export function mapResultAsync<T, U, E>(
  result: Result<T, E>,
  mapFn: (value: T) => Promise<U>,
): Promise<Result<U, E>> {
  if (!result.ok) {
    return Promise.resolve(result);
  }

  return mapFn(result.value).then((value) => ok(value));
}

export function andThen<T, U, E>(
  result: Result<T, E>,
  mapFn: (value: T) => Result<U, E>,
): Result<U, E> {
  return result.ok ? mapFn(result.value) : result;
}

export async function andThenAsync<T, U, E>(
  result: Result<T, E>,
  mapFn: (value: T) => Promise<Result<U, E>>,
): Promise<Result<U, E>> {
  if (!result.ok) {
    return result;
  }

  return mapFn(result.value);
}

export function matchResult<T, E, U>(
  result: Result<T, E>,
  handlers: {
    readonly ok: (value: T) => U;
    readonly err: (error: E) => U;
  },
): U {
  return result.ok ? handlers.ok(result.value) : handlers.err(result.error);
}

export function fromThrowable<T>(fn: () => T): Result<T, AppError> {
  try {
    return ok(fn());
  } catch (error) {
    return err(normalizeError(error));
  }
}

export async function fromPromise<T>(
  promise: Promise<T>,
): Promise<Result<T, AppError>> {
  try {
    return ok(await promise);
  } catch (error) {
    return err(normalizeError(error));
  }
}

/**
 * Aggregates Results in order. Short-circuits on the first Err.
 */
export function allResults<T, E>(
  results: readonly Result<T, E>[],
): Result<T[], E> {
  const values: T[] = [];

  for (const result of results) {
    if (!result.ok) {
      return result;
    }

    values.push(result.value);
  }

  return ok(values);
}
