import type { ProjectId } from "@sujeetd7/ai-engineering-project-adapter-contracts";

/** Supported AI Engineering Platform version for this consumer. */
export const SUPPORTED_PLATFORM_VERSION = "0.1.1" as const;

/** Stable project identity for the frontend monorepo. */
export const FRONTEND_PROJECT_ID = "nexus-ai-workspace-frontend" as ProjectId;

/** Logical namespace grouping the frontend workspace. */
export const FRONTEND_PROJECT_NAMESPACE = "nexus.workspace" as const;

/** Registry identity for the frontend project adapter registry. */
export const FRONTEND_ADAPTER_REGISTRY_ID =
  "registry.nexus.frontend.project-adapters" as const;

/** Root package version from package.json. */
export const FRONTEND_PROJECT_VERSION = "1.0.0" as const;

/** GitHub repository URL (origin remote). */
export const FRONTEND_REPOSITORY_URL =
  "https://github.com/sujeetd7/nexus-ai-workspace-frontend" as const;
