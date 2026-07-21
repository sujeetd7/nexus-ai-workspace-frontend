# ADR-0002: Package manager and Node runtime

- Status: Accepted
- Date: 2026-07-22
- Deciders: Frontend platform

## Context

Mixed package managers and Node versions create non-reproducible installs and CI drift across web and mobile contributors.

## Decision

Standardize on:

- **pnpm** `9.15.9` (`packageManager` field + `engine-strict`)
- **Node.js** `22.22.2` (`.nvmrc` / `engines.node`)

Installs must use `pnpm install --frozen-lockfile` in CI.

## Consequences

- Contributors and CI share one toolchain contract.
- Accidental npm/yarn usage is rejected by engine and packageManager checks.
- Lockfile updates become intentional, reviewable changes.
