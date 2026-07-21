# Syncpack Dependency Policy

Sprint 0 replaces catch-all Syncpack ignores with explicit version and semver groups in `.syncpackrc.json`.

## Version groups

| Group                         | Purpose                                                                     |
| ----------------------------- | --------------------------------------------------------------------------- |
| Local packages                | Pin `@nexus/*` deps to `workspace:*`                                        |
| Mobile React Native toolchain | Ignore intentional RN/web divergence for React, ESLint 8, RN packages, etc. |
| shared-ui peers               | Allow broad `react` / `react-native` peer ranges                            |
| Default                       | All remaining dependencies must match across packages                       |

## Semver groups

| Group                          | Range policy                                          |
| ------------------------------ | ----------------------------------------------------- |
| Workspace protocol             | Exact `workspace:*`                                   |
| Prettier                       | Exact                                                 |
| React Native packages (mobile) | Exact                                                 |
| Pinned root tooling            | Exact (`typescript`, `jest`, commitlint, syncpack, …) |
| shared-network TypeScript      | Exact until packages standardize on caret             |
| Remaining dependencies         | Prefer `^`                                            |

## Verification

```powershell
pnpm deps:check
pnpm install --frozen-lockfile
```
