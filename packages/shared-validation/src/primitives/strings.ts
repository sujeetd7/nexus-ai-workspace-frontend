import { z } from "zod";

/** Trimmed non-empty string. */
export const nonEmptyTrimmedStringSchema = z
  .string()
  .transform((value) => value.trim())
  .pipe(z.string().min(1));

/** RFC-style email validation for auth forms. */
export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address");

/** Minimum password policy for client-side validation. */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");

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
