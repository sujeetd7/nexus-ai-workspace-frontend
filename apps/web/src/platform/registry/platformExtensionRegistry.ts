import type {
  AgentRegistryContract,
  AiProviderContract,
  McpProviderContract,
  ToolRegistryContract,
} from "@nexus/shared-types";
import { PLATFORM_EXTENSION_KEYS } from "@nexus/shared-types";
import {
  createDependencyRegistry,
  type DependencyRegistry,
} from "@nexus/shared-utils";

export type PlatformExtensionServices = {
  [PLATFORM_EXTENSION_KEYS.AI_PROVIDER]: AiProviderContract;
  [PLATFORM_EXTENSION_KEYS.MCP_PROVIDER]: McpProviderContract;
  [PLATFORM_EXTENSION_KEYS.TOOL_REGISTRY]: ToolRegistryContract;
  [PLATFORM_EXTENSION_KEYS.AGENT_REGISTRY]: AgentRegistryContract;
};

export type PlatformExtensionRegistry =
  DependencyRegistry<PlatformExtensionServices>;

/**
 * Empty typed extension registry — Sprint 4+ slots only.
 * No AI/MCP/tool/agent implementations in Batch 3.4.
 */
export function createPlatformExtensionRegistry(): PlatformExtensionRegistry {
  return createDependencyRegistry<PlatformExtensionServices>();
}
