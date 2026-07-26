---
name: nexus-runtime-isolation
description: >-
  Enforces tooling-only isolation for AI Engineering Platform packages.
  Use when touching tooling/engineering-platform or @sujeetd7/ai-engineering-*.
---

# nexus-runtime-isolation

## Purpose

Keep AI Engineering Platform packages out of product runtime.

## Workflow

1. Confirm work belongs under `tooling/engineering-platform/` (or docs/CI wiring for that consumer).
2. Verify no new imports of `@sujeetd7/ai-engineering-*` enter:
   - `apps/web`
   - `apps/mobile`
   - `@nexus/shared-ui`
   - AppProviders / product provider trees
3. Prefer metadata/capability declarations over enabling deferred platform features.
4. After changes, recommend `pnpm boundaries:check` and engineering-platform isolation tests via `nexus-validation` (user-owned; do not execute unless asked).

## Constraints

- Supported platform version is pinned (`0.1.1`) unless a batch explicitly upgrades it.
- Do not wire Figma MCP, OpenAPI, RTK Query platform features, or AI Runtime unless the batch enables them.
- Do not commit tokens or alter secret handling.
- Do not change published platform package APIs from this consumer repo.

## Expected output

- Isolation confirmation (runtime paths clean)
- Files touched under tooling/docs/CI only (unless batch says otherwise)
- Any boundary risk called out before merge
