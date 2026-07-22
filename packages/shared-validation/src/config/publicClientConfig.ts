import {
  ERROR_CODES,
  type AppError,
  type PublicClientConfig,
  type Result,
} from "@nexus/shared-types";
import { z } from "zod";

export const DEFAULT_PUBLIC_APP_NAME = "Nexus AI Workspace";

const BUILD_MODES = ["development", "test", "production"] as const;

function ok(
  value: PublicClientConfig,
): Result<PublicClientConfig, AppError> {
  return { ok: true, value };
}

function err(error: AppError): Result<PublicClientConfig, AppError> {
  return { ok: false, error };
}

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
const absoluteHttpUrlSchema = z
  .string()
  .transform((value) => value.trim())
  .pipe(z.string().min(1).refine(isAbsoluteHttpUrl, { abort: true }));

/**
 * Validates a plain public-configuration input object.
 * Does not read environment globals or platform APIs.
 */
export const publicClientConfigSchema = z
  .object({
    buildMode: z.enum(BUILD_MODES),
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

function issueCategory(code: string): string {
  switch (code) {
    case "invalid_type":
      return "invalid_type";
    case "too_small":
      return "empty";
    case "invalid_format":
    case "custom":
      return "invalid_url";
    case "invalid_value":
    case "invalid_enum_value":
      return "unsupported_value";
    case "unrecognized_keys":
      return "unknown_field";
    default:
      return "invalid";
  }
}

function toConfigurationError(zodError: z.ZodError): AppError {
  const fields = new Set<string>();
  const categories = new Set<string>();

  for (const issue of zodError.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && field.length > 0) {
      fields.add(field);
    } else {
      fields.add("config");
    }
    categories.add(issueCategory(issue.code));
  }

  const fieldList = [...fields].sort().join(",");
  const categoryList = [...categories].sort().join(",");

  return {
    code: ERROR_CODES.CONFIGURATION,
    message: "Invalid public client configuration.",
    retryable: false,
    metadata: {
      fields: fieldList,
      categories: categoryList,
      issueCount: zodError.issues.length,
    },
  };
}

/**
 * Parse → validate → derive → freeze public client configuration.
 * Never freezes or returns the raw input object.
 */
export function parsePublicClientConfig(
  input: unknown,
): Result<PublicClientConfig, AppError> {
  const parsed = publicClientConfigSchema.safeParse(input);

  if (!parsed.success) {
    return err(toConfigurationError(parsed.error));
  }

  return ok(parsed.data);
}
