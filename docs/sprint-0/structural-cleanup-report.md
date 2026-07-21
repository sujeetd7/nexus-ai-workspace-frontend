# Sprint 0 Structural Cleanup Report

## Status

Pending final tracked-file review.

## Scope

This review covers:

- speculative `.gitkeep` directories
- duplicate scaffolding
- overlapping packages
- generated outputs
- temporary files
- stale lockfiles
- unused configuration
- public exports of deferred modules

## Completed Cleanup

- temporary generator validation output excluded
- build outputs excluded from tracked evidence
- Node and pnpm versions standardized
- React Native Metro monorepo resolution corrected
- React Native ESLint isolated from root flat configuration
- stale dependency-policy mismatches resolved
- networking tests added
- generator tests added

## `.gitkeep` Review Rule

A `.gitkeep`-only directory should remain only when:

1. it is required by an immediate implementation batch;
2. a tool depends on the directory existing;
3. it documents an approved architecture boundary;
4. its purpose is documented.

All other `.gitkeep`-only directories should be removed.

## Pending Decisions

- remove unsupported speculative directories
- resolve ownership overlap among UI/theme packages
- review all microfrontend folders
- remove public exports for deferred or empty implementations

## Recommendation

Complete cleanup only after reviewing:

```text
docs/sprint-0/evidence/gitkeep-audit.txt
docs/sprint-0/evidence/structure-evidence.txt
```
