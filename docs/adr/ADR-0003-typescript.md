# ADR-0003: Strict TypeScript strategy

- Status: Accepted
- Date: 2026-07-22
- Deciders: Frontend platform

## Context

Loose TypeScript settings allow boundary leaks between apps and shared packages and hide contract breaks until runtime.

## Decision

Use a shared strict base TypeScript configuration under `configs/typescript/` with:

- `strict`, `noImplicitAny`, `strictNullChecks`
- `noUncheckedIndexedAccess`
- Per-package/app `tsconfig` extending the base

`pnpm typecheck` (via Turbo) is a required quality gate.

## Consequences

- Shared package public APIs are typed at the boundary.
- Incremental adoption of looser settings is discouraged.
- Generators and networking contracts must remain type-safe.
