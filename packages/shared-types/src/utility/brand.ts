declare const __brand: unique symbol;

/**
 * Nominal (branded) wrapper around a base type.
 * Prevents accidental mixing of semantically different values that share a runtime shape.
 */
export type Brand<T, TBrand extends string> = T & {
  readonly [__brand]: TBrand;
};

/**
 * Opaque alias of {@link Brand} for call sites that prefer opaque terminology.
 */
export type Opaque<T, TToken extends string> = Brand<T, TToken>;

/**
 * Generic branded string identifier. Product-specific IDs should specialize this
 * (e.g. `Brand<string, "UserId">`) rather than living in shared-types yet.
 */
export type EntityId<TName extends string = "Entity"> = Brand<
  string,
  `${TName}Id`
>;
