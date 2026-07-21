# ADR-0011: Isolate React Native ESLint

- Status: Accepted
- Date: 2026-07-22
- Deciders: Frontend platform

## Context

React Native’s ESLint stack (ESLint 8 + legacy RN config) conflicts with the root/web flat ESLint 10 toolchain.

## Decision

Keep mobile linting isolated:

- Mobile uses `cross-env ESLINT_USE_FLAT_CONFIG=false eslint .` with RN’s ESLint 8 config.
- Root/web use flat ESLint 10 configuration.
- Syncpack treats the mobile ESLint toolchain as an intentional independent version group.

## Consequences

- Mobile and web can upgrade ESLint on different cadences.
- Contributors must run mobile lint via the mobile package scripts.
- A future unified ESLint major requires an explicit migration ADR.
