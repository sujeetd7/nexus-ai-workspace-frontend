# Storybook (Web)

Official Design System development environment for `@nexus/shared-ui` (Batch 2.6 / ADR-0013).

**Scope:** Web only. React Native Storybook is not configured.

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
```

## Hierarchy

- **Primitives** — View, Text, Stack, Button, Input, Label, Divider, Loader
- **Composites** — FormField, HelperText, ErrorText, Badge, Chip, Card, Surface, Section

No Pattern or Screen categories in Batch 2.6.

## Provider rules

- Decorators use `SharedUIProvider` with controlled `preference` from the Theme toolbar.
- Do **not** import `TamaguiProvider` / `Theme` from `@tamagui/core` in stories.
- Stories must exercise **production** package exports only (`@nexus/shared-ui`).

## Theme / a11y / controls

- Theme toolbar: light / dark / system
- Controls / args on CSF stories
- `@storybook/addon-a11y` panel (lightweight; not a replacement for unit a11y tests)
- `@storybook/addon-docs` + autodocs tags

## Story requirements

Every completed component should cover, as applicable:

- Default
- Variants / sizes
- Disabled / loading / error
- Light + dark (toolbar)
- Responsive examples where meaningful (e.g. Stack `media`)
- Accessibility-oriented examples (labels, roles, reduced-motion notes)

## Bundle isolation

Storybook is **devDependency** tooling under `apps/web`. Production `vite build` does not import `.storybook` or `src/stories`. Measure app bundle separately from `storybook:build` output size.

## Related

- ADR-0013, ADR-0010 (superseded for web)
- `docs/architecture/MOTION.md`
- `docs/architecture/COMPONENTS.md`
