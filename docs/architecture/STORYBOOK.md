# Storybook (Web)

Official Design System development environment for `@nexus/shared-ui` (Batch 2.6 / ADR-0013).

**Scope:** Web only. React Native Storybook is not configured (TD-057).

Governance process: [`DESIGN_SYSTEM_GOVERNANCE.md`](./DESIGN_SYSTEM_GOVERNANCE.md).  
Hierarchy model: [`HYBRID_ENTERPRISE_ATOMIC.md`](./HYBRID_ENTERPRISE_ATOMIC.md).

## Commands

| Command                       | Purpose                                    |
| ----------------------------- | ------------------------------------------ |
| `pnpm storybook`              | Dev server on port 6006                    |
| `pnpm storybook:build`        | Static build → `apps/web/storybook-static` |
| `pnpm --filter web storybook` | Same as root `storybook`                   |

`pnpm verify` includes `storybook:build`.

## Layout

```text
apps/web/
  .storybook/
    main.ts          # Vite + Tamagui + RNW resolve (mirrors vite.config)
    preview.tsx      # SharedUIProvider + theme toolbar
  src/stories/
    Introduction.mdx
    primitives/*.stories.tsx
    composites/*.stories.tsx
    patterns/          # placeholder — no stories in Sprint 2
    screens/           # placeholder — no stories in Sprint 2
```

## Hierarchy (required titles)

```text
Primitives
Composites
Patterns      ← placeholder (no implemented patterns)
Screens       ← placeholder (app-owned; catalog deferred)
```

| Prefix              | Level | Current content                                                       |
| ------------------- | ----- | --------------------------------------------------------------------- |
| `Primitives/<Name>` | 1     | View, Text, Stack, Button, Input, Label, Divider, Loader              |
| `Composites/<Name>` | 2     | FormField, HelperText, ErrorText, Badge, Chip, Card, Surface, Section |
| `Patterns/<Name>`   | 3     | None — examples only in docs                                          |
| `Screens/<Name>`    | 4     | None in shared Storybook                                              |

Do not use Atomic labels (atoms/molecules/organisms) in story titles.

## Provider rules

- Decorators use `SharedUIProvider` with controlled `preference` from the Theme toolbar.
- Do **not** import `TamaguiProvider` / `Theme` from `@tamagui/core` in stories.
- Stories must exercise **production** package exports only (`@nexus/shared-ui`).

## Story naming conventions

| Rule                   | Example                                        |
| ---------------------- | ---------------------------------------------- |
| File                   | `Button.stories.tsx`                           |
| Default export `title` | `Primitives/Button`                            |
| Story exports          | PascalCase (`Default`, `Disabled`, `Variants`) |
| Autodocs               | `tags: ["autodocs"]` on meta                   |

## Required story coverage

Every future Ready shared component should include, as applicable:

| Story / capability       | Required when                                   |
| ------------------------ | ----------------------------------------------- |
| Default                  | Always                                          |
| Variants                 | Component has variants                          |
| Sizes                    | Component has sizes                             |
| Disabled                 | Interactive / disableable                       |
| Loading                  | Loading state exists                            |
| Error                    | Error/invalid state exists                      |
| Light + dark theme       | Always (Theme toolbar)                          |
| Responsive example       | Layout/media props exist                        |
| Accessibility example    | Labels, roles, reduced-motion notes as relevant |
| Controls / args          | Always for primary props                        |
| Documentation (Docs tab) | Always (`autodocs` or MDX)                      |

## Storybook review checklist

- [ ] Title matches Hybrid level prefix
- [ ] Uses `SharedUIProvider` only (via preview decorator)
- [ ] No Tamagui providers in story file
- [ ] Required coverage present
- [ ] Addon-a11y panel reviewed for obvious violations
- [ ] Does not import deep `@nexus/shared-ui/src/**`
- [ ] Production component API only (no story-only forks)

## Theme / a11y / controls

- Theme toolbar: light / dark / system
- Controls / args on CSF stories
- `@storybook/addon-a11y` panel (lightweight; not a replacement for unit a11y tests)
- `@storybook/addon-docs` + autodocs tags

## Bundle isolation

Storybook is **devDependency** tooling under `apps/web`. Production `vite build` does not import `.storybook` or `src/stories`. Measure app bundle separately from `storybook:build` output size.

## Related

- ADR-0013, ADR-0010 (superseded for web), ADR-0014
- `MOTION.md`, `COMPONENTS.md`, `GENERATOR_GOVERNANCE.md`
