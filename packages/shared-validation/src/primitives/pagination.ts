import type { CursorPageRequest, PageRequest } from "@nexus/shared-types";
import { z } from "zod";
import { positiveIntSchema } from "./numbers";
import { nonEmptyTrimmedStringSchema } from "./strings";

/** Closed page/pageSize request matching `PageRequest`. */
export const pageRequestSchema: z.ZodType<PageRequest> = z
  .object({
    page: positiveIntSchema,
    pageSize: positiveIntSchema,
  })
  .strict();

/** Closed cursor/limit request matching `CursorPageRequest`. */
export const cursorPageRequestSchema: z.ZodType<CursorPageRequest> = z
  .object({
    cursor: nonEmptyTrimmedStringSchema.optional(),
    limit: positiveIntSchema,
  })
  .strict();
