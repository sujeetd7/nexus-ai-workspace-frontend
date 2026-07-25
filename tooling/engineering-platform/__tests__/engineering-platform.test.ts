import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { RESULT_KINDS } from "@sujeetd7/ai-engineering-contracts";
import {
  PROJECT_BUILD_SYSTEMS,
  PROJECT_COMMANDS,
  PROJECT_FRAMEWORKS,
  PROJECT_PACKAGE_MANAGERS,
  PROJECT_TYPES,
} from "@sujeetd7/ai-engineering-project-adapter-contracts";
import { REGISTRY_ERROR_CODES } from "@sujeetd7/ai-engineering-registry-runtime";

import {
  FRONTEND_CAPABILITY_METADATA,
  FRONTEND_PROJECT_ID,
  FRONTEND_PROJECT_VERSION,
  SUPPORTED_PLATFORM_VERSION,
  createFrontendProjectDescriptor,
} from "../src/index.js";
import {
  lookupFrontendProjectAdapter,
  registerFrontendProjectAdapter,
  resetFrontendProjectAdapterRegistryForTests,
} from "../src/registry.js";

describe("frontend project descriptor", () => {
  it("uses existing repository metadata", () => {
    const descriptor = createFrontendProjectDescriptor();

    assert.equal(descriptor.identity.id, FRONTEND_PROJECT_ID);
    assert.equal(descriptor.identity.type, PROJECT_TYPES.MONOREPO);
    assert.equal(descriptor.identity.version, FRONTEND_PROJECT_VERSION);
    assert.deepEqual(descriptor.identity.supportedPlatformVersions, [
      SUPPORTED_PLATFORM_VERSION,
    ]);
    assert.equal(descriptor.metadata.packageManager, PROJECT_PACKAGE_MANAGERS.PNPM);
    assert.equal(descriptor.metadata.buildSystem, PROJECT_BUILD_SYSTEMS.TURBO);
    assert.deepEqual(descriptor.metadata.frameworks, [
      PROJECT_FRAMEWORKS.REACT,
      PROJECT_FRAMEWORKS.REACT_NATIVE,
    ]);
    assert.match(descriptor.metadata.technologyStack?.join(" ") ?? "", /tamagui@2\.4\.6/);
    assert.equal(descriptor.metadata.repository?.organization, "sujeetd7");
    assert.equal(descriptor.metadata.repository?.name, "nexus-ai-workspace-frontend");

    const webApp = descriptor.structure?.units.find((unit) => unit.id === "apps.web");
    const mobileApp = descriptor.structure?.units.find((unit) => unit.id === "apps.mobile");
    assert.ok(webApp);
    assert.ok(mobileApp);

    const commandScripts = new Set(
      descriptor.commands?.map((entry) => entry.script).filter(Boolean),
    );
    assert.ok(commandScripts.has("lint"));
    assert.ok(commandScripts.has("typecheck"));
    assert.ok(commandScripts.has("test"));
    assert.ok(commandScripts.has("build"));
    assert.ok(commandScripts.has("verify"));
    assert.ok(commandScripts.has("storybook"));

    const docsStandard = descriptor.standards?.find((entry) => entry.id === "docs.architecture");
    assert.ok(docsStandard);
  });
});

describe("frontend adapter registration", () => {
  it("registers exactly one adapter and lookup succeeds", () => {
    resetFrontendProjectAdapterRegistryForTests();

    const registered = registerFrontendProjectAdapter();
    assert.equal(registered.kind, RESULT_KINDS.SUCCESS);
    if (registered.kind !== RESULT_KINDS.SUCCESS) {
      return;
    }

    const lookedUp = lookupFrontendProjectAdapter();
    assert.equal(lookedUp.kind, RESULT_KINDS.SUCCESS);
    if (lookedUp.kind !== RESULT_KINDS.SUCCESS) {
      return;
    }

    assert.equal(lookedUp.value.identity.id, FRONTEND_PROJECT_ID);
    assert.equal(String(lookedUp.value.identity.version), FRONTEND_PROJECT_VERSION);
  });

  it("rejects duplicate registration with contract-compliant errors", () => {
    resetFrontendProjectAdapterRegistryForTests();

    const first = registerFrontendProjectAdapter();
    assert.equal(first.kind, RESULT_KINDS.SUCCESS);
    if (first.kind !== RESULT_KINDS.SUCCESS) {
      return;
    }

    const duplicate = first.value.registry.register(first.value.descriptor);
    assert.equal(duplicate.kind, RESULT_KINDS.FAILURE);
    if (duplicate.kind !== RESULT_KINDS.FAILURE) {
      return;
    }

    assert.equal(duplicate.error.causeCode, REGISTRY_ERROR_CODES.DUPLICATE_ENTRY);
  });

  it("is deterministic across repeated registration calls", () => {
    resetFrontendProjectAdapterRegistryForTests();

    const first = registerFrontendProjectAdapter();
    const second = registerFrontendProjectAdapter();
    assert.equal(first.kind, RESULT_KINDS.SUCCESS);
    assert.equal(second.kind, RESULT_KINDS.SUCCESS);
    if (first.kind !== RESULT_KINDS.SUCCESS || second.kind !== RESULT_KINDS.SUCCESS) {
      return;
    }

    assert.equal(first.value.descriptor.identity.id, second.value.descriptor.identity.id);
  });
});

describe("frontend capability metadata", () => {
  it("declares only existing tooling surfaces", () => {
    const surfaces = FRONTEND_CAPABILITY_METADATA.flatMap((entry) => {
      if (entry.features?.surface) {
        return [String(entry.features.surface)];
      }
      return [entry.capability];
    });

    assert.ok(surfaces.includes("react"));
    assert.ok(surfaces.includes("react-native"));
    assert.ok(surfaces.includes("storybook"));
    assert.ok(surfaces.includes("diagnostics"));
    assert.ok(surfaces.includes("architecture-validation"));
    assert.ok(surfaces.includes("dependency-validation"));
    assert.ok(surfaces.includes("ci-cd"));
  });
});

describe("public barrel imports", () => {
  it("imports Wave 1 public barrels only", async () => {
    const contracts = await import("@sujeetd7/ai-engineering-contracts");
    const adapterContracts = await import(
      "@sujeetd7/ai-engineering-project-adapter-contracts"
    );
    const adapterRegistry = await import(
      "@sujeetd7/ai-engineering-project-adapter-registry"
    );

    assert.ok(contracts.RESULT_KINDS);
    assert.ok(adapterContracts.PROJECT_COMMANDS);
    assert.equal(adapterContracts.PROJECT_COMMANDS.LINT, PROJECT_COMMANDS.LINT);
    assert.ok(typeof adapterRegistry.createProjectAdapterRegistry === "function");
  });
});
