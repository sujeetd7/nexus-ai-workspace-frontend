---
name: nexus-openapi-integration
description: >-
  Guides OpenAPI client integration when a batch explicitly enables it.
  Use for OpenAPI / generated API client work. Currently deferred by default.
---

# nexus-openapi-integration

## Purpose

Integrate OpenAPI-derived clients without violating network and package boundaries.

## Workflow

1. Confirm the batch explicitly enables OpenAPI work (otherwise stop — deferred).
2. Keep transport ownership in `@nexus/shared-network` / approved app API adapters.
3. Place feature-specific types and calls in feature-owned modules; do not dump them into `@nexus/shared-types`.
4. Reuse existing Result / AppError / validation patterns.
5. Do not introduce a new networking stack or Axios usage outside approved locations.
6. Apply `nexus-validation` to report recommended user commands (including boundary checks) — do not execute gates unless asked.

## Constraints

- Default status: deferred (see `IMPLEMENTATION_STATUS.md` / consumer install docs).
- No deep imports. No feature-to-feature imports.
- Shared-validation stays free of network and React dependencies.
- Do not commit generated secrets or environment credentials.
- Do not run full validation unless the user explicitly requests it.

## Expected output

- Integration surfaces touched
- Ownership map (shared vs feature vs app adapter)
- Explicit deferrals if platform support is incomplete
- Validation not run — user-owned; recommended commands
