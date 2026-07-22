/**
 * Exhaustiveness check for discriminated unions.
 * Calling this with a non-`never` value is a TypeScript compile error.
 */
export function assertNever(value: never, message?: string): never {
  throw new Error(message ?? `Unexpected value: ${String(value)}`);
}
