/** Successful {@link Result} variant. */
export interface Ok<T> {
  readonly ok: true;
  readonly value: T;
}

/** Failed {@link Result} variant. */
export interface Err<E> {
  readonly ok: false;
  readonly error: E;
}

/**
 * Discriminated success/failure union.
 * HTTP transport errors remain in `@nexus/shared-network` (`ApiError`).
 */
export type Result<T, E = Error> = Ok<T> | Err<E>;
