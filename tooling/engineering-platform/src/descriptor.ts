import { OWNERSHIP_SCOPES, type ComponentOwner } from "@sujeetd7/ai-engineering-contracts";
import {
  PROJECT_BUILD_SYSTEMS,
  PROJECT_COMMANDS,
  PROJECT_CONFIGURATION_KINDS,
  PROJECT_FRAMEWORKS,
  PROJECT_LANGUAGES,
  PROJECT_PACKAGE_MANAGERS,
  PROJECT_STANDARD_KINDS,
  PROJECT_STRUCTURE_KINDS,
  PROJECT_TYPES,
  type ProjectAdapterDescriptor,
  type ProjectId,
  type ProjectNamespace,
} from "@sujeetd7/ai-engineering-project-adapter-contracts";

import { FRONTEND_CAPABILITY_METADATA } from "./capabilities.js";
import {
  FRONTEND_PROJECT_ID,
  FRONTEND_PROJECT_NAMESPACE,
  FRONTEND_PROJECT_VERSION,
  FRONTEND_REPOSITORY_URL,
  SUPPORTED_PLATFORM_VERSION,
} from "./constants.js";

const owner: ComponentOwner = {
  id: "owner-nexus-frontend" as ComponentOwner["id"],
  displayName: "Nexus AI Workspace Frontend",
  scope: OWNERSHIP_SCOPES.CONSUMER,
  packageName: "nexus-ai-workspace-frontend",
  team: "sujeetd7",
};

/**
 * Canonical frontend project adapter descriptor.
 * Built from existing repository metadata only — no repository scanning.
 */
export function createFrontendProjectDescriptor(): ProjectAdapterDescriptor {
  return Object.freeze({
    identity: Object.freeze({
      id: FRONTEND_PROJECT_ID as ProjectId,
      namespace: FRONTEND_PROJECT_NAMESPACE as ProjectNamespace,
      type: PROJECT_TYPES.MONOREPO,
      owner,
      version: FRONTEND_PROJECT_VERSION,
      supportedPlatformVersions: [SUPPORTED_PLATFORM_VERSION],
    }),
    metadata: Object.freeze({
      name: "Nexus AI Workspace Frontend",
      description:
        "pnpm + Turbo monorepo for React web and React Native mobile with shared packages",
      languages: [PROJECT_LANGUAGES.TYPESCRIPT],
      frameworks: [PROJECT_FRAMEWORKS.REACT, PROJECT_FRAMEWORKS.REACT_NATIVE],
      buildSystem: PROJECT_BUILD_SYSTEMS.TURBO,
      packageManager: PROJECT_PACKAGE_MANAGERS.PNPM,
      technologyStack: Object.freeze(["tamagui@2.4.6", "turbo@2.5.6", "pnpm@9.15.9"]),
      repository: Object.freeze({
        host: "github.com",
        organization: "sujeetd7",
        name: "nexus-ai-workspace-frontend",
        defaultBranch: "master",
        url: FRONTEND_REPOSITORY_URL,
      }),
      tags: Object.freeze(["consumer", "wave-1", "tooling-only"]),
    }),
    structure: Object.freeze({
      units: Object.freeze([
        Object.freeze({
          kind: PROJECT_STRUCTURE_KINDS.APPLICATION,
          id: "apps.web",
          name: "web",
          path: "apps/web",
          description: "React web application",
        }),
        Object.freeze({
          kind: PROJECT_STRUCTURE_KINDS.APPLICATION,
          id: "apps.mobile",
          name: "mobile",
          path: "apps/mobile",
          description: "React Native mobile application",
        }),
        Object.freeze({
          kind: PROJECT_STRUCTURE_KINDS.PACKAGE,
          id: "packages.shared-ui",
          name: "@nexus/shared-ui",
          path: "packages/shared-ui",
        }),
        Object.freeze({
          kind: PROJECT_STRUCTURE_KINDS.PACKAGE,
          id: "packages.shared-types",
          name: "@nexus/shared-types",
          path: "packages/shared-types",
        }),
        Object.freeze({
          kind: PROJECT_STRUCTURE_KINDS.PACKAGE,
          id: "packages.shared-utils",
          name: "@nexus/shared-utils",
          path: "packages/shared-utils",
        }),
        Object.freeze({
          kind: PROJECT_STRUCTURE_KINDS.PACKAGE,
          id: "packages.shared-network",
          name: "@nexus/shared-network",
          path: "packages/shared-network",
        }),
        Object.freeze({
          kind: PROJECT_STRUCTURE_KINDS.PACKAGE,
          id: "packages.shared-validation",
          name: "@nexus/shared-validation",
          path: "packages/shared-validation",
        }),
        Object.freeze({
          kind: PROJECT_STRUCTURE_KINDS.DOCUMENTATION,
          id: "docs.root",
          name: "Documentation",
          path: "docs",
        }),
        Object.freeze({
          kind: PROJECT_STRUCTURE_KINDS.DOCUMENTATION,
          id: "docs.implementation-status",
          name: "Implementation Status",
          path: "IMPLEMENTATION_STATUS.md",
        }),
        Object.freeze({
          kind: PROJECT_STRUCTURE_KINDS.OTHER,
          id: "tooling.engineering-platform",
          name: "@nexus/engineering-platform-tooling",
          path: "tooling/engineering-platform",
          description: "AI Engineering Platform consumer tooling",
        }),
      ]),
    }),
    capabilities: FRONTEND_CAPABILITY_METADATA,
    commands: Object.freeze([
      Object.freeze({ command: PROJECT_COMMANDS.INSTALL, script: "install:all" }),
      Object.freeze({ command: PROJECT_COMMANDS.LINT, script: "lint" }),
      Object.freeze({ command: PROJECT_COMMANDS.TYPECHECK, script: "typecheck" }),
      Object.freeze({ command: PROJECT_COMMANDS.TEST, script: "test" }),
      Object.freeze({ command: PROJECT_COMMANDS.BUILD, script: "build" }),
      Object.freeze({ command: PROJECT_COMMANDS.VERIFY, script: "verify" }),
      Object.freeze({ command: PROJECT_COMMANDS.STORYBOOK, script: "storybook" }),
    ]),
    standards: Object.freeze([
      Object.freeze({
        kind: PROJECT_STANDARD_KINDS.ARCHITECTURE,
        id: "docs.architecture",
        name: "Architecture documentation",
        uri: "docs/architecture",
      }),
      Object.freeze({
        kind: PROJECT_STANDARD_KINDS.DOCUMENTATION,
        id: "docs.setup",
        name: "Setup documentation",
        uri: "docs/setup",
      }),
      Object.freeze({
        kind: PROJECT_STANDARD_KINDS.DOCUMENTATION,
        id: "docs.adr",
        name: "Architecture decision records",
        uri: "docs/adr",
      }),
    ]),
    configurations: Object.freeze([
      Object.freeze({
        kind: PROJECT_CONFIGURATION_KINDS.TOOLING,
        id: "turbo",
        name: "Turbo",
        path: "turbo.json",
      }),
      Object.freeze({
        kind: PROJECT_CONFIGURATION_KINDS.LINT,
        id: "eslint",
        name: "ESLint",
        path: "configs/eslint",
      }),
      Object.freeze({
        kind: PROJECT_CONFIGURATION_KINDS.TEST,
        id: "jest.root",
        name: "Jest",
        path: "jest.config.cjs",
      }),
      Object.freeze({
        kind: PROJECT_CONFIGURATION_KINDS.CI,
        id: "github.quality",
        name: "Frontend Quality workflow",
        path: ".github/workflows/quality.yml",
      }),
    ]),
  });
}
