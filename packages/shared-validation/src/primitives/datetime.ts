import type { ISODateString, ISODateTimeString } from "@nexus/shared-types";
import { z } from "zod";

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Requires timezone: `Z` or `±HH:MM` / `±HHMM`. */
const ISO_DATE_TIME_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:?\d{2})$/;

function isValidCalendarDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * ISO-8601 calendar date `YYYY-MM-DD` branded as `ISODateString`.
 * Does not convert to `Date`.
 */
export const isoDateStringSchema = z
  .string()
  .transform((value) => value.trim())
  .pipe(
    z
      .string()
      .min(1)
      .refine((value) => {
        const match = ISO_DATE_PATTERN.exec(value);
        if (!match) {
          return false;
        }

        return isValidCalendarDate(
          Number(match[1]),
          Number(match[2]),
          Number(match[3]),
        );
      }, { abort: true })
      .transform((value): ISODateString => value as ISODateString),
  );

/**
 * ISO-8601 date-time with required timezone (`Z` or offset).
 * Branded as `ISODateTimeString`. Does not convert to `Date`.
 */
export const isoDateTimeStringSchema = z
  .string()
  .transform((value) => value.trim())
  .pipe(
    z
      .string()
      .min(1)
      .refine((value) => {
        if (!ISO_DATE_TIME_PATTERN.test(value)) {
          return false;
        }

        const parsed = Date.parse(value);
        return !Number.isNaN(parsed);
      }, { abort: true })
      .transform((value): ISODateTimeString => value as ISODateTimeString),
  );
