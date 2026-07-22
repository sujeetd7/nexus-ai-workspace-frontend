import { z } from "zod";

/** Integer greater than or equal to 1. No string coercion. */
export const positiveIntSchema = z.number().int().positive();

/** Integer greater than or equal to 0. No string coercion. */
export const nonNegativeIntSchema = z.number().int().nonnegative();
