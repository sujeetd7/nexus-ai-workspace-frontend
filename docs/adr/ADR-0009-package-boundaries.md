# ADR-0009: Package and import boundaries

- Status: Accepted
- Date: 2026-07-22
- Deciders: Frontend platform

## Context

Without enforced boundaries, apps and packages develop circular dependencies, deep imports, and Axios usage outside networking.

## Decision

Enforce dependency rules documented in `docs/architecture/dependency-rules.md`:

- Packages never import apps.
- Import `@nexus/<package>` public APIs only (no deep imports).
- Axios is allowed only in `@nexus/shared-network` and platform `apps/*/src/api` adapters.
- Web features must not import other features.

Enforcement: ESLint `configs/eslint/boundaries.mjs` + `pnpm boundaries:check`.

## Consequences

- Architecture regressions fail in lint/CI.
- Shared networking extraction remains durable.
- Feature teams must place shared contracts in store/api/shared layers.
