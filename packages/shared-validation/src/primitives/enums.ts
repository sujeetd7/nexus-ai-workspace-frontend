import { z } from "zod";

export const BUILD_MODES = ["development", "test", "production"] as const;

/** Build mode enum aligned with `BuildMode` in shared-types. */
export const buildModeSchema = z.enum(BUILD_MODES);
