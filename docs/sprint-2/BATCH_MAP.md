# Sprint 2 Batch Map

Canonical scope map for Sprint 2 design-system work. Batch 2.2 absorbed the theme-engine work originally anticipated later; **do not reimplement theme switching, persistence, or Tamagui theme sync in later batches**.

## Batch 2.1 — Complete

- Tamagui foundation (`@tamagui/core`)
- `SharedUIProvider` composition root
- Initial token → Tamagui mapping
- Web RNW + Vite integration
- Mobile shared-ui wiring

## Batch 2.2 — Complete (reconciled scope)

Completed in commits through Batch 2.2 finalization:

- Shared UI public theme API review (`useTheme` contract)
- Design-token foundation (palette, spacing, radius, elevation, shadows, opacity, z-index, motion durations)
- Semantic token mapping (light/dark)
- Typography completion (weights, line heights, letter spacing)
- Theme engine (preference model, resolved mode, switching)
- Light, dark, and system preferences
- Theme synchronization with Tamagui (`<Theme name={mode}>`)
- Optional persistence foundation (`StorageAdapter` injection + canonical storage key)

## Batch 2.3 — Complete

- Responsive foundation (single breakpoint SoT, Tamagui media sync, device-class helpers)
- Accessibility foundation (WCAG 2.2 AA target, keyboard/focus/SR/role conventions)
- Color-contrast validation for documented semantic text pairs
- Reduced-motion preference helpers (web + RN-ready subscription)
- React Native minimum touch-target constants (44×44)
- Component maturity checklist integration
- Docs: `RESPONSIVE_DESIGN.md`, `ACCESSIBILITY.md`

**Out of Batch 2.3:** primitive/composite component implementation, Storybook, product/feature UI, focus-trap frameworks, `jsx-a11y` dependency (TD-052).

## Batch 2.4 — Complete (Level 1 primitives)

- Migrated/implemented: `View`, `Text`, `Stack` (+ `XStack`/`YStack`), `Button`, `Input`, `Label`, `Divider`, `Loader`
- Tamagui-backed via `@tamagui/core` only (no full component kit)
- Additive semantic tokens: `onPrimary`, `onDanger`, `focusRing` (contrast-tested)
- Docs: `docs/architecture/COMPONENTS.md`
- Component tests under SharedUIProvider (jsdom + RNW alias)

**Out of Batch 2.4:** composites, Storybook, icon system, FormField, skeletons/progress bars.

## Batch 2.5 — Complete (Level 2 composites)

- Implemented: `FormField`, `HelperText`, `ErrorText`, `Badge`, `Chip`, `Card`, `Surface`, `Section`
- Additive primitive support only: Input `describedBy`, Text `id` (for describedby associations)
- No new semantic color tokens (Badge uses outline + `text` for AA; status borders decorative)
- Tooltip **not** implemented — Tamagui full-kit + portal/gesture peers not justified yet (see `COMPONENTS.md`)
- Docs: `COMPONENTS.md`, `DESIGN_SYSTEM.md`, Technical Debt TD-056
- Tests: shared-ui composite coverage + public export checks

**Out of Batch 2.5:** Dialog, Sheet, Drawer, Toast, Popover, Menu, Select, data table, charts, product UI, Storybook, removable chips, icon system, React Hook Form.

## Batch 2.6 — Complete (Motion + Web Storybook + Quality)

- Motion helpers: `resolveTransitionDuration`, `createCssTransition`, `createMotionStyle` + `MOTION.md`
- Web Storybook under `apps/web` with stories for all completed primitives/composites (`STORYBOOK.md`, ADR-0013)
- Theme toolbar + `SharedUIProvider`; addon-docs + addon-a11y
- Quality tests + testing utility `renderWithThemePreference`
- RN Storybook still deferred (TD-057)

**Out of Batch 2.6:** React Native Storybook, new UI components, patterns/screens, overlays, product UI, animation drivers.

## Batch 2.7 — Complete (Design System governance)

- Adopted Hybrid Enterprise Atomic organization (Primitives → Composites → Patterns → Screens) — **organizational only** (ADR-0014)
- Governance docs: `HYBRID_ENTERPRISE_ATOMIC.md`, `DESIGN_SYSTEM_GOVERNANCE.md`, `GENERATOR_GOVERNANCE.md`, `PUBLIC_API_GOVERNANCE.md`
- Storybook hierarchy extended with Patterns/Screens placeholders; review + naming standards in `STORYBOOK.md`
- Generator standards defined (Primitive/Composite/Pattern required later; Screen deferred) — **not implemented**
- Component classification inventory in `COMPONENTS.md`
- No production UI components, export changes, dependency changes, or provider changes

**Out of Batch 2.7:** Pattern/Screen implementation, Design System generator implementation, RN Storybook, overlays, architecture redesign.

## Batch 2.8+ (not started)

- Remaining work per sprint plan (overlays / patterns when approved)

## Related docs

- `docs/architecture/DESIGN_SYSTEM.md`
- `docs/architecture/DESIGN_SYSTEM_GOVERNANCE.md`
- `docs/architecture/HYBRID_ENTERPRISE_ATOMIC.md`
- `docs/architecture/THEME_ENGINE.md`
- `docs/architecture/RESPONSIVE_DESIGN.md`
- `docs/architecture/ACCESSIBILITY.md`
- `docs/architecture/COMPONENTS.md`
- `docs/architecture/MOTION.md`
- `docs/architecture/STORYBOOK.md`
- `docs/architecture/GENERATOR_GOVERNANCE.md`
- `docs/architecture/PUBLIC_API_GOVERNANCE.md`
- `IMPLEMENTATION_STATUS.md`
- ADR-0012, ADR-0013, ADR-0014
