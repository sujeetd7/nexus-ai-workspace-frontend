import { nonEmptyTrimmedStringSchema } from "./strings";

/**
 * Non-empty trimmed identifier string.
 * Compatible with `EntityId` branding at the call site; not UUID-specific.
 */
export const nonEmptyIdSchema = nonEmptyTrimmedStringSchema;
