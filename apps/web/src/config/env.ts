type EnvironmentMode = "development" | "test" | "production";

function readRequiredEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

export const env = {
  appName: import.meta.env.VITE_APP_NAME?.trim() || "Nexus AI Workspace",

  apiUrl: readRequiredEnv("VITE_API_URL"),

  graphqlUrl: readRequiredEnv("VITE_GRAPHQL_URL"),

  environment: import.meta.env.MODE as EnvironmentMode,

  isDevelopment: import.meta.env.DEV,

  isProduction: import.meta.env.PROD,
} as const;
