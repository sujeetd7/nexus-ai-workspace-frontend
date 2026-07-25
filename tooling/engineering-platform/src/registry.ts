import { RESULT_KINDS, type PlatformError, type Result } from "@sujeetd7/ai-engineering-contracts";
import type { ProjectAdapterDescriptor } from "@sujeetd7/ai-engineering-project-adapter-contracts";
import { createProjectAdapterRegistry } from "@sujeetd7/ai-engineering-project-adapter-registry";
import type {
  ProjectAdapterRegistry,
} from "@sujeetd7/ai-engineering-project-adapter-registry";
import type { RegistryId } from "@sujeetd7/ai-engineering-registry-runtime";

import { createFrontendProjectAdapter } from "./adapter-factory.js";
import {
  FRONTEND_ADAPTER_REGISTRY_ID,
  FRONTEND_PROJECT_ID,
  FRONTEND_PROJECT_VERSION,
  SUPPORTED_PLATFORM_VERSION,
} from "./constants.js";

let cachedRegistry: ProjectAdapterRegistry | undefined;
let registrationComplete = false;

function getOrCreateRegistry(): Result<ProjectAdapterRegistry, PlatformError> {
  if (cachedRegistry !== undefined) {
    return { kind: RESULT_KINDS.SUCCESS, value: cachedRegistry };
  }

  const created = createProjectAdapterRegistry({
    identity: {
      id: FRONTEND_ADAPTER_REGISTRY_ID as RegistryId,
      name: "Nexus Frontend Project Adapter Registry",
      version: SUPPORTED_PLATFORM_VERSION,
    },
  });

  if (created.kind === RESULT_KINDS.FAILURE) {
    return created;
  }

  cachedRegistry = created.value;
  return created;
}

export interface FrontendAdapterRegistration {
  readonly registry: ProjectAdapterRegistry;
  readonly descriptor: ProjectAdapterDescriptor;
}

/**
 * Registers exactly one frontend adapter in the platform registry.
 * Deterministic and idempotent — duplicate calls return the existing registration.
 */
export function registerFrontendProjectAdapter(): Result<
  FrontendAdapterRegistration,
  PlatformError
> {
  const registryResult = getOrCreateRegistry();
  if (registryResult.kind === RESULT_KINDS.FAILURE) {
    return registryResult;
  }

  const registry = registryResult.value;
  const { descriptor } = createFrontendProjectAdapter();

  if (registrationComplete) {
    const existing = registry.lookup(FRONTEND_PROJECT_ID, FRONTEND_PROJECT_VERSION);
    if (existing.kind === RESULT_KINDS.SUCCESS) {
      return {
        kind: RESULT_KINDS.SUCCESS,
        value: Object.freeze({ registry, descriptor: existing.value }),
      };
    }
    return existing;
  }

  const registered = registry.register(descriptor);
  if (registered.kind === RESULT_KINDS.FAILURE) {
    return registered;
  }

  registrationComplete = true;
  return {
    kind: RESULT_KINDS.SUCCESS,
    value: Object.freeze({ registry, descriptor: registered.value }),
  };
}

/**
 * Looks up the registered frontend adapter by canonical identity.
 */
export function lookupFrontendProjectAdapter(
  version: string = FRONTEND_PROJECT_VERSION,
): Result<ProjectAdapterDescriptor, PlatformError> {
  const registryResult = getOrCreateRegistry();
  if (registryResult.kind === RESULT_KINDS.FAILURE) {
    return registryResult;
  }

  return registryResult.value.lookup(FRONTEND_PROJECT_ID, version);
}

/** Test-only reset — not exported from the public barrel. */
export function resetFrontendProjectAdapterRegistryForTests(): void {
  cachedRegistry = undefined;
  registrationComplete = false;
}
