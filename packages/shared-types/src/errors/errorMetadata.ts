/**
 * Flat, JSON-safe metadata only.
 * Nested objects, arrays, and non-primitive values are not part of the public contract.
 */
export type ErrorMetadataValue = string | number | boolean | null;

export type ErrorMetadata = Readonly<Record<string, ErrorMetadataValue>>;
