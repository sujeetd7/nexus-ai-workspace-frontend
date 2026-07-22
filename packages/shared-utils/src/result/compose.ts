import type { AppError, Result } from "@nexus/shared-types";

import { normalizeError } from "../errors";
import { err, isErr, isOk, ok } from "./result";

export function mapResultAsync<T, U, E>(
  result: Result<T, E>,
  mapFn: (value: T) => Promise<U>,
): Promise<Result<U, E>> {
  if (isErr(result)) {
    return Promise.resolve(err(result.error));
  }

  return mapFn(result.value).then((value) => ok(value));
}

export function andThen<T, U, E>(
  result: Result<T, E>,
  mapFn: (value: T) => Result<U, E>,
): Result<U, E> {
  if (isErr(result)) {
    return err(result.error);
  }

  return mapFn(result.value);
}

export async function andThenAsync<T, U, E>(
  result: Result<T, E>,
  mapFn: (value: T) => Promise<Result<U, E>>,
): Promise<Result<U, E>> {
  if (isErr(result)) {
    return err(result.error);
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
  if (isOk(result)) {
    return handlers.ok(result.value);
  }

  return handlers.err(result.error);
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
    if (isErr(result)) {
      return err(result.error);
    }

    values.push(result.value);
  }

  return ok(values);
}
