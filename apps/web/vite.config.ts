import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    env: {
      VITE_API_URL: "http://localhost:3000/api",
      VITE_GRAPHQL_URL: "http://localhost:3000/graphql",
      VITE_APP_NAME: "Nexus AI Workspace",
    },
  },
});
