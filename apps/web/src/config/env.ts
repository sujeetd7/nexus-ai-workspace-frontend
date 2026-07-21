export const env = {
  appName: import.meta.env.VITE_APP_NAME,

  apiUrl: import.meta.env.VITE_API_URL,

  graphqlUrl: import.meta.env.VITE_GRAPHQL_URL,

  environment: import.meta.env.MODE,

  isDevelopment: import.meta.env.DEV,

  isProduction: import.meta.env.PROD,
} as const;
