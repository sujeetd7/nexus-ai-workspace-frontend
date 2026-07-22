/**
 * Compatibility logger export for existing `api/observability` imports.
 *
 * Prefer `@/platform/logging` (`webLogger` / `createWebLogger`) for new code.
 * This re-export will be removed once call sites migrate (see TD-040).
 */
export { webLogger as logger } from "../../platform/logging";
