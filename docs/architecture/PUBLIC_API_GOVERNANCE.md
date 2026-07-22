# Public API Governance (`@nexus/shared-ui`)

Batch 2.7 documentation for stable consumption of the Design System package.

Architecture ownership remains in [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).

---

## Stable exports

Applications and features **must** import from the package root (or approved subpaths):

```ts
import {
  Button,
  FormField,
  SharedUIProvider,
  useTheme,
} from "@nexus/shared-ui";
```

Approved subpaths:

| Subpath                           | Audience                                            |
| --------------------------------- | --------------------------------------------------- |
| `@nexus/shared-ui`                | Runtime UI, providers, tokens, helpers              |
| `@nexus/shared-ui/tamagui-config` | Build tooling only                                  |
| `@nexus/shared-ui/testing`        | Tests/tooling only (contrast, `renderWithSharedUI`) |

### Forbidden

```ts
import Button from "@nexus/shared-ui/src/components/Button";
import { TamaguiProvider } from "@tamagui/core"; // in apps
```

Deep imports and direct Tamagui provider usage are boundary violations (ADR-0009 / ADR-0012).

---

## Package ownership

| Concern                                               | Owner                            |
| ----------------------------------------------------- | -------------------------------- |
| Public barrel (`src/index.ts`, `components/index.ts`) | Frontend platform                |
| Adding exports                                        | Requires Ready maturity + review |
| Removing / renaming exports                           | Breaking change — see below      |

Do not create parallel UI packages (`shared-theme`, `ui-kit`).

---

## Extension rules

- New components: Hybrid level assigned; export only when Ready.
- New tokens: real consumer + light/dark + contrast as required (`DESIGN_SYSTEM.md`).
- New subpath exports: require ADR or explicit platform approval.
- Do not re-export Tamagui primitives as Nexus public API.

---

## Deprecation policy

1. Mark deprecated in types/docs with migration notes.
2. Keep export functional for at least one minor line (while package is `0.x`, document in changelog / IMPLEMENTATION_STATUS).
3. Remove only in a clearly communicated breaking change.

---

## Breaking-change policy

Breaking changes include: removed exports, changed required props, semantic token renames, provider contract changes.

Required:

- Document in PR + IMPLEMENTATION_STATUS / COMPONENTS
- Prefer additive changes
- For `0.x`, still avoid silent breaks across apps in the monorepo (update all consumers in the same change)

---

## Semantic version expectations

| Range                             | Expectation                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------ |
| `0.x` (current private workspace) | Monorepo consumers updated atomically; treat root export changes as repo-wide  |
| `1.x` (if published later)        | SemVer: major for breaks, minor for additive Ready components, patch for fixes |

Workspace protocol (`workspace:*`) does not remove the need for careful public API discipline.

---

## Verification

- Export tests (`primitives.exports.test.ts`, `composites.exports.test.ts`)
- ESLint / boundary checks block deep imports where configured
- Storybook and apps must use package root only

---

## Related

- `docs/architecture/dependency-rules.md`
- `docs/sprint-0/package-ownership-matrix.md`
- `HYBRID_ENTERPRISE_ATOMIC.md`
- `DESIGN_SYSTEM_GOVERNANCE.md`
