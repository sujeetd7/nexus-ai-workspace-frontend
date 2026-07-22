import { z } from "zod";

/** Trimmed non-empty string. */
export const nonEmptyTrimmedStringSchema = z
  .string()
  .transform((value) => value.trim())
  .pipe(z.string().min(1));

/** Optional string that is trimmed when present. Empty/whitespace becomes undefined. */
export const optionalTrimmedStringSchema = z
  .string()
  .optional()
  .transform((value) => {
    if (value === undefined) {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  });
