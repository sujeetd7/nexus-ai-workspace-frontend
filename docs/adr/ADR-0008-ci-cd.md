# ADR-0008: CI/CD quality pipeline

- Status: Accepted
- Date: 2026-07-22
- Deciders: Frontend platform

## Context

Sprint 0 needs a secret-free quality gate before product CI/CD and release automation.

## Decision

Use GitHub Actions workflow `Frontend Quality` to run:

1. `pnpm install --frozen-lockfile`
2. `pnpm deps:check`
3. `pnpm verify` (lint, typecheck, boundaries, tests, build)

Hosted SonarQube scanning and deployment pipelines are deferred (see `docs/sprint-0/sonarqube-baseline.md`).

## Consequences

- PRs get a reproducible quality signal.
- Release/deploy workflows remain future work with separate permissions.
- Branch protection should require this workflow once rulesets are applied.
