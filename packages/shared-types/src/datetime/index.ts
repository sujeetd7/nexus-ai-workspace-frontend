import type { Brand } from "../utility/brand";

/** Calendar date in ISO-8601 `YYYY-MM-DD` form (branded string). */
export type ISODateString = Brand<string, "ISODateString">;

/** Instant in ISO-8601 date-time form (branded string). */
export type ISODateTimeString = Brand<string, "ISODateTimeString">;
