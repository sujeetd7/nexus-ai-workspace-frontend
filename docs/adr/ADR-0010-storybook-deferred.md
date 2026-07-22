# ADR-0010: Defer Storybook

- Status: Superseded by [ADR-0013](./ADR-0013-web-storybook.md) (web)
- Date: 2026-07-22
- Deciders: Frontend platform / CTO review

## Context

Interactive component documentation is valuable, but Sprint 0 prioritizes monorepo, CI, generators, and networking foundations.

## Decision

Defer Storybook (and related visual documentation tooling) beyond Sprint 0.

Tracked as technical debt **TD-002**.

## Consequences

- Shared UI relies on unit tests and package exports for now.
- Design-system documentation remains a later sprint commitment.
- No Storybook CI surface area during Sprint 0.

## Supersession

Batch 2.6 adopted **web** Storybook (ADR-0013). React Native Storybook remains deferred.
