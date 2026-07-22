import { z } from "zod";

function isAbsoluteHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Absolute http(s) URL after trim. Uses the URL constructor so localhost and
 * LAN hosts remain valid (Zod's httpUrl hostname pattern rejects localhost).
 */
export const absoluteHttpUrlSchema = z
  .string()
  .transform((value) => value.trim())
  .pipe(z.string().min(1).refine(isAbsoluteHttpUrl, { abort: true }));

/** Optional absolute http(s) URL. */
export const optionalAbsoluteHttpUrlSchema = absoluteHttpUrlSchema.optional();
