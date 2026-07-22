# Architecture Decision Record Index

Canonical ADR directory: `docs/adr/`.

Do not add ADRs under `docs/architecture/adr/` — that path is a pointer only.

| ADR      | Decision                        | Status                      | File                                                                 |
| -------- | ------------------------------- | --------------------------- | -------------------------------------------------------------------- |
| ADR-0001 | pnpm + TurboRepo monorepo       | Accepted                    | [ADR-0001-monorepo.md](./ADR-0001-monorepo.md)                       |
| ADR-0002 | pnpm 9.15.9 and Node.js 22.22.2 | Accepted                    | [ADR-0002-package-manager.md](./ADR-0002-package-manager.md)         |
| ADR-0003 | Strict TypeScript strategy      | Accepted                    | [ADR-0003-typescript.md](./ADR-0003-typescript.md)                   |
| ADR-0004 | Redux Toolkit application state | Accepted                    | [ADR-0004-state-management.md](./ADR-0004-state-management.md)       |
| ADR-0005 | RTK Query for server state      | Accepted                    | [ADR-0005-rtk-query.md](./ADR-0005-rtk-query.md)                     |
| ADR-0006 | GraphQL via shared networking   | Accepted                    | [ADR-0006-graphql.md](./ADR-0006-graphql.md)                         |
| ADR-0007 | Testing strategy                | Accepted                    | [ADR-0007-testing.md](./ADR-0007-testing.md)                         |
| ADR-0008 | CI quality pipeline             | Accepted                    | [ADR-0008-ci-cd.md](./ADR-0008-ci-cd.md)                             |
| ADR-0009 | Package and import boundaries   | Accepted                    | [ADR-0009-package-boundaries.md](./ADR-0009-package-boundaries.md)   |
| ADR-0010 | Defer Storybook                 | Superseded (web → ADR-0013) | [ADR-0010-storybook-deferred.md](./ADR-0010-storybook-deferred.md)   |
| ADR-0011 | Isolate React Native ESLint     | Accepted                    | [ADR-0011-react-native-eslint.md](./ADR-0011-react-native-eslint.md) |
| ADR-0012 | Tamagui UI foundation           | Accepted                    | [ADR-0012-tamagui.md](./ADR-0012-tamagui.md)                         |
| ADR-0013 | Adopt Web Storybook             | Accepted                    | [ADR-0013-web-storybook.md](./ADR-0013-web-storybook.md)             |

## ADR Rules

- ADRs are immutable after acceptance.
- Material changes require a new ADR.
- Superseded ADRs remain in the repository with updated status.
- ADR IDs must be unique (`ADR-####`); validated by `pnpm adr:check`.
- Architecture-affecting Sprint 1 changes require CTO review.
