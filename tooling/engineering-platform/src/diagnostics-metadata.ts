/**
 * Diagnostics metadata for existing repository quality gates.
 * Declarative only — no command execution.
 */
export const FRONTEND_DIAGNOSTICS_METADATA = Object.freeze({
  version: "0.1.0",
  surfaces: Object.freeze([
    Object.freeze({
      id: "quality.verify",
      name: "Full quality pipeline",
      script: "verify",
      description: "lint, typecheck, boundaries, adr, test, build, storybook:build",
    }),
    Object.freeze({
      id: "quality.boundaries",
      name: "Import boundary scan",
      script: "boundaries:check",
      path: "scripts/check-import-boundaries.mjs",
    }),
    Object.freeze({
      id: "quality.deps",
      name: "Dependency policy",
      script: "deps:check",
      path: ".syncpackrc.json",
    }),
    Object.freeze({
      id: "quality.adr",
      name: "ADR identifier check",
      script: "adr:check",
      path: "scripts/check-adr-ids.mjs",
    }),
  ]),
});

export type FrontendDiagnosticsMetadata = typeof FRONTEND_DIAGNOSTICS_METADATA;
