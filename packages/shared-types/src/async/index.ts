/** Value that may already be resolved or wrapped in a Promise. */
export type Awaitable<T> = T | Promise<T>;

/** Alias of {@link Awaitable} for call sites that prefer MaybePromise naming. */
export type MaybePromise<T> = Awaitable<T>;
