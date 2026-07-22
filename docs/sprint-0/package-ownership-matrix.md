# Package Ownership Matrix

| Package             | Primary Responsibility                    | Allowed Contents                                                                                                                                                               | Must Not Contain                            |
| ------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| `shared-types`      | Shared TypeScript contracts               | domain types, API types, common interfaces; Batch 1.1 type primitives (`Brand`/`Opaque`, Result, pagination, datetime brands, `Logger`/`StorageAdapter` contracts, `AppError`) | runtime business logic, UI, HTTP `ApiError` |
| `shared-utils`      | Platform-safe helpers                     | pure utilities, test builders; Batch 1.1 runtime helpers (`assertNever`, Result helpers, `createId`)                                                                           | browser-only or React-specific logic        |
| `shared-validation` | Shared validation contracts               | Zod schemas, validation helpers                                                                                                                                                | API transport or UI                         |
| `shared-network`    | Platform-neutral HTTP/GraphQL transport   | Axios client helpers, RTK/GraphQL base queries, retries, redaction                                                                                                             | UI, feature modules, app-specific storage   |
| `shared-ui`         | Cross-platform UI foundation              | components, tokens, themes, responsive helpers                                                                                                                                 | product features, application state, Axios  |
| `shared-theme`      | Candidate: theme-only package             | tokens and theme composition only                                                                                                                                              | duplicate UI components                     |
| `ui-kit`            | Candidate: presentation component library | design-system components only                                                                                                                                                  | duplicate theme ownership                   |

## Overlap Decision

The preferred target is:

- `shared-ui` owns cross-platform UI components and consumes a single theme source.
- Only one package should own design tokens and theme construction.
- `ui-kit` should exist only if it has a distinct consumer contract and release boundary.
- `shared-theme` should exist only if theme assets are consumed independently by multiple UI implementations.

## Consolidation Recommendation

Unless repository evidence proves independent consumers:

1. consolidate tokens and themes into `shared-ui`;
2. remove duplicate `shared-theme` and `ui-kit` scaffolding;
3. preserve internal folders to keep future extraction possible;
4. avoid publishing three overlapping packages during Sprint 0.

## Required Evidence Before Keeping Separate Packages

- independent consumers
- distinct ownership
- separate release lifecycle
- measurable build or runtime boundary
- clear dependency direction
