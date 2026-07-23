/**
 * Platform extensibility contracts.
 * Applications own registry orchestration; this package owns shared shapes only.
 * No IoC, reflection, decorators, or runtime discovery.
 */

/** Stable platform service keys for typed dependency registration. */
export const PLATFORM_SERVICE_KEYS = {
  LOGGER: "logger",
  CONFIG: "config",
  STORAGE: "storage",
  HTTP_CLIENT: "httpClient",
  GRAPHQL_CLIENT: "graphqlClient",
  AI_PROVIDER: "aiProvider",
  MCP_PROVIDER: "mcpProvider",
  TOOL_REGISTRY: "toolRegistry",
  AGENT_REGISTRY: "agentRegistry",
} as const;

export type PlatformServiceKey =
  (typeof PLATFORM_SERVICE_KEYS)[keyof typeof PLATFORM_SERVICE_KEYS];

/** Registration / resolution failure codes. */
export const REGISTRATION_FAILURE_CODES = {
  DUPLICATE_SERVICE_KEY: "DUPLICATE_SERVICE_KEY",
  DUPLICATE_FEATURE_ID: "DUPLICATE_FEATURE_ID",
  MISSING_FEATURE_DEPENDENCY: "MISSING_FEATURE_DEPENDENCY",
  CIRCULAR_FEATURE_DEPENDENCY: "CIRCULAR_FEATURE_DEPENDENCY",
  REGISTRY_SEALED: "REGISTRY_SEALED",
  SERVICE_NOT_FOUND: "SERVICE_NOT_FOUND",
  FEATURE_REGISTRATION_FAILED: "FEATURE_REGISTRATION_FAILED",
} as const;

export type RegistrationFailureCode =
  (typeof REGISTRATION_FAILURE_CODES)[keyof typeof REGISTRATION_FAILURE_CODES];

export interface RegistrationError {
  readonly code: RegistrationFailureCode;
  readonly message: string;
  readonly details?: Readonly<
    Record<string, string | number | boolean | undefined>
  >;
}

/** Feature lifecycle stages — contracts only; no workers/schedulers. */
export const FEATURE_LIFECYCLE_STAGES = {
  REGISTER: "register",
  INITIALIZE: "initialize",
  READY: "ready",
  DISPOSE: "dispose",
} as const;

export type FeatureLifecycleStage =
  (typeof FEATURE_LIFECYCLE_STAGES)[keyof typeof FEATURE_LIFECYCLE_STAGES];

/**
 * Typed feature manifest.
 * Callbacks close over application runtime — no routes/UI/auth metadata.
 * Initialize remains synchronous for Batch 3.4 bootstrap compatibility.
 */
export interface FeatureManifest {
  readonly id: string;
  readonly displayName: string;
  readonly version: string;
  /** Other feature IDs this feature depends on (explicit, static). */
  readonly dependencies?: readonly string[];
  readonly register?: () => void;
  readonly initialize?: () => void;
  readonly onReady?: () => void;
  readonly onDispose?: () => void;
}

/**
 * Placeholder contracts for Sprint 4+ — interfaces only, no behavior.
 */
export interface AiProviderContract {
  readonly kind: "ai-provider";
}

export interface McpProviderContract {
  readonly kind: "mcp-provider";
}

export interface ToolRegistryContract {
  readonly kind: "tool-registry";
}

export interface AgentRegistryContract {
  readonly kind: "agent-registry";
}

/** Extension slot identifiers for the platform extension registry. */
export const PLATFORM_EXTENSION_KEYS = {
  AI_PROVIDER: "aiProvider",
  MCP_PROVIDER: "mcpProvider",
  TOOL_REGISTRY: "toolRegistry",
  AGENT_REGISTRY: "agentRegistry",
} as const;

export type PlatformExtensionKey =
  (typeof PLATFORM_EXTENSION_KEYS)[keyof typeof PLATFORM_EXTENSION_KEYS];

export interface PlatformExtensionMap {
  readonly aiProvider?: AiProviderContract;
  readonly mcpProvider?: McpProviderContract;
  readonly toolRegistry?: ToolRegistryContract;
  readonly agentRegistry?: AgentRegistryContract;
}
