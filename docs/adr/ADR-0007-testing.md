# ADR-0007: Testing strategy

- Status: Accepted
- Date: 2026-07-22
- Deciders: Frontend platform

## Context

Web (Vite) and shared/mobile packages need automated tests without forcing a single runner that fights each platform’s toolchain.

## Decision

- **Vitest** for the web app and `@nexus/shared-network`.
- **Jest** for React Native and existing shared packages that already use Jest.
- Generator security tests use Node’s built-in test runner via `pnpm test:generators`.
- Coverage artifacts are not committed; `coverage/` is gitignored.

## Consequences

- Platforms keep appropriate runners.
- Root `pnpm test` aggregates Turbo package tests plus generator tests.
- Cross-package coverage consolidation is deferred to Sonar integration (TD-003).
