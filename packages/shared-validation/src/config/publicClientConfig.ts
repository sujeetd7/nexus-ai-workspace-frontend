import {
  ERROR_CODES,
  type AppError,
  type PublicClientConfig,
  type Result,
} from "@nexus/shared-types";
import { z } from "zod";
import { parseWithSchema } from "../parse/parseWithSchema";
import { buildModeSchema } from "../primitives/enums";
import { absoluteHttpUrlSchema } from "../primitives/urls";

export const DEFAULT_PUBLIC_APP_NAME = "Nexus AI Workspace";

/**
 * Validates a plain public-configuration input object.
 * Does not read environment globals or platform APIs.
 */
export const publicClientConfigSchema = z
  .object({
    buildMode: buildModeSchema,
    apiBaseUrl: absoluteHttpUrlSchema,
    graphqlUrl: absoluteHttpUrlSchema,
    appName: z.string().optional(),
  })
  .strict()
  .transform((data): PublicClientConfig => {
    const trimmedName = data.appName?.trim();
    const appName =
      trimmedName !== undefined && trimmedName.length > 0
        ? trimmedName
        : DEFAULT_PUBLIC_APP_NAME;

    return Object.freeze({
      buildMode: data.buildMode,
      apiBaseUrl: data.apiBaseUrl,
      graphqlUrl: data.graphqlUrl,
      appName,
      isDevelopment: data.buildMode === "development",
      isProduction: data.buildMode === "production",
    });
  });

/**
 * Parse → validate → derive → freeze public client configuration.
 * Never freezes or returns the raw input object.
 */
export function parsePublicClientConfig(
  input: unknown,
): Result<PublicClientConfig, AppError> {
  return parseWithSchema(publicClientConfigSchema, input, {
    errorCode: ERROR_CODES.CONFIGURATION,
    message: "Invalid public client configuration.",
    fallbackField: "config",
  });
}
