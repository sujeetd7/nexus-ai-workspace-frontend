import {
  REGISTRATION_FAILURE_CODES,
  type RegistrationError,
  type Result,
} from "@nexus/shared-types";

import { err, ok } from "../result";

export interface DependencyRegistry<TMap extends Record<string, unknown>> {
  register<K extends keyof TMap & string>(key: K, value: TMap[K]): void;
  resolve<K extends keyof TMap & string>(key: K): TMap[K];
  tryResolve<K extends keyof TMap & string>(key: K): TMap[K] | undefined;
  has(key: keyof TMap & string): boolean;
  /** Freeze further registration. Resolution remains available. */
  seal(): void;
  isSealed(): boolean;
  getRegistrationOrder(): readonly (keyof TMap & string)[];
}

/**
 * Lightweight typed dependency registry.
 * Explicit register/resolve only — no reflection, decorators, or discovery.
 */
export function createDependencyRegistry<
  TMap extends Record<string, unknown>,
>(): DependencyRegistry<TMap> {
  const values = new Map<keyof TMap & string, TMap[keyof TMap]>();
  const order: Array<keyof TMap & string> = [];
  let sealed = false;

  return {
    register<K extends keyof TMap & string>(key: K, value: TMap[K]): void {
      if (sealed) {
        throw createRegistrationError(
          REGISTRATION_FAILURE_CODES.REGISTRY_SEALED,
          `Cannot register "${key}" after the registry is sealed.`,
          { key },
        );
      }
      if (values.has(key)) {
        throw createRegistrationError(
          REGISTRATION_FAILURE_CODES.DUPLICATE_SERVICE_KEY,
          `Service key "${key}" is already registered.`,
          { key },
        );
      }
      values.set(key, value);
      order.push(key);
    },

    resolve<K extends keyof TMap & string>(key: K): TMap[K] {
      if (!values.has(key)) {
        throw createRegistrationError(
          REGISTRATION_FAILURE_CODES.SERVICE_NOT_FOUND,
          `Service key "${key}" is not registered.`,
          { key },
        );
      }
      return values.get(key) as TMap[K];
    },

    tryResolve<K extends keyof TMap & string>(key: K): TMap[K] | undefined {
      return values.get(key) as TMap[K] | undefined;
    },

    has(key: keyof TMap & string): boolean {
      return values.has(key);
    },

    seal(): void {
      sealed = true;
    },

    isSealed(): boolean {
      return sealed;
    },

    getRegistrationOrder(): readonly (keyof TMap & string)[] {
      return [...order];
    },
  };
}

export function createRegistrationError(
  code: RegistrationError["code"],
  message: string,
  details?: RegistrationError["details"],
): RegistrationError & Error {
  const error = Object.assign(new Error(message), {
    name: "RegistrationError",
    code,
    details,
  }) as RegistrationError & Error;
  return error;
}

export function isRegistrationError(
  value: unknown,
): value is RegistrationError & Error {
  return (
    value instanceof Error &&
    value.name === "RegistrationError" &&
    typeof (value as unknown as RegistrationError).code === "string"
  );
}

export interface FeatureGraphNode {
  readonly id: string;
  readonly dependencies?: readonly string[];
}

/**
 * Validates feature IDs and returns a deterministic topological registration order.
 * Detects duplicates, missing dependencies, and cycles.
 */
export function resolveFeatureRegistrationOrder(
  features: readonly FeatureGraphNode[],
): Result<readonly string[], RegistrationError> {
  const byId = new Map<string, FeatureGraphNode>();

  for (const feature of features) {
    if (byId.has(feature.id)) {
      return err(
        createRegistrationError(
          REGISTRATION_FAILURE_CODES.DUPLICATE_FEATURE_ID,
          `Feature id "${feature.id}" is registered more than once.`,
          { featureId: feature.id },
        ),
      );
    }
    byId.set(feature.id, feature);
  }

  for (const feature of features) {
    for (const dependency of feature.dependencies ?? []) {
      if (!byId.has(dependency)) {
        return err(
          createRegistrationError(
            REGISTRATION_FAILURE_CODES.MISSING_FEATURE_DEPENDENCY,
            `Feature "${feature.id}" depends on missing feature "${dependency}".`,
            { featureId: feature.id, dependency },
          ),
        );
      }
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const order: string[] = [];

  function visit(id: string): RegistrationError | undefined {
    if (visited.has(id)) {
      return undefined;
    }
    if (visiting.has(id)) {
      return createRegistrationError(
        REGISTRATION_FAILURE_CODES.CIRCULAR_FEATURE_DEPENDENCY,
        `Circular feature dependency detected at "${id}".`,
        { featureId: id },
      );
    }

    visiting.add(id);
    const node = byId.get(id);
    for (const dependency of node?.dependencies ?? []) {
      const cycle = visit(dependency);
      if (cycle) {
        return cycle;
      }
    }
    visiting.delete(id);
    visited.add(id);
    order.push(id);
    return undefined;
  }

  // Stable input order for roots — deterministic across runs.
  for (const feature of features) {
    const cycle = visit(feature.id);
    if (cycle) {
      return err(cycle);
    }
  }

  return ok(order);
}

/**
 * Runs feature lifecycle hooks in dependency order:
 * register → initialize → onReady. Dispose is deferred to future shutdown work.
 */
export function runFeatureRegistrationPipeline(
  features: readonly (FeatureGraphNode & {
    readonly register?: () => void;
    readonly initialize?: () => void;
    readonly onReady?: () => void;
  })[],
): Result<readonly string[], RegistrationError> {
  const orderResult = resolveFeatureRegistrationOrder(features);
  if (!orderResult.ok) {
    return orderResult;
  }

  const byId = new Map(features.map((feature) => [feature.id, feature]));

  try {
    for (const id of orderResult.value) {
      byId.get(id)?.register?.();
    }
    for (const id of orderResult.value) {
      byId.get(id)?.initialize?.();
    }
    for (const id of orderResult.value) {
      byId.get(id)?.onReady?.();
    }
  } catch (cause) {
    if (isRegistrationError(cause)) {
      return err(cause);
    }
    return err(
      createRegistrationError(
        REGISTRATION_FAILURE_CODES.FEATURE_REGISTRATION_FAILED,
        cause instanceof Error
          ? cause.message
          : "Feature registration pipeline failed.",
      ),
    );
  }

  return ok(orderResult.value);
}
