# Microfrontend Review

## Decision Standard

Each `*-mf` application must satisfy at least one strong enterprise criterion:

- independent deployment
- distinct team ownership
- runtime isolation
- independent release cadence
- measurable business or operational requirement

## Current Recommendation

If these criteria are not supported by repository and organizational evidence, consolidate the microfrontend applications into the main web application.

## Consolidation Approach

Retain microfrontend-ready boundaries through:

- feature-first folders
- route-level lazy loading
- isolated Redux slices and sagas
- explicit public feature exports
- no cross-feature internal imports
- independent test boundaries
- stable shared package contracts

## Why Consolidation Is Safer Now

Premature microfrontends introduce:

- deployment complexity
- duplicated dependencies
- routing complexity
- shared-state complexity
- local development overhead
- version skew
- slower CI
- unclear ownership

## Approval Requirement

No `*-mf` application should remain solely because microfrontends are considered an enterprise pattern.

Every retained application must document:

| Criterion              | Evidence |
| ---------------------- | -------- |
| Independent deployment | Pending  |
| Team ownership         | Pending  |
| Runtime isolation      | Pending  |
| Release independence   | Pending  |
| Business justification | Pending  |

## Proposed Outcome

Status: Consolidate unless evidence justifies separation.
