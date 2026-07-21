# ADR-0001: pnpm + TurboRepo monorepo

- Status: Accepted
- Date: 2026-07-22
- Deciders: Frontend platform

## Context

The frontend must support web and React Native from a single repository with shared packages, consistent tooling, and one quality gate.

## Decision

Use a pnpm workspace monorepo orchestrated by TurboRepo.

- Workspace packages live under `apps/*` and `packages/*`.
- Root scripts invoke Turbo for lint, typecheck, test, and build.
- Shared libraries are published only as private `@nexus/*` workspace packages.

## Consequences

- Shared code and tooling stay consistent across platforms.
- Package boundaries and dependency direction must be enforced explicitly.
- CI runs from the repository root with frozen lockfile installs.
