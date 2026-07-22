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

## Batch 2.4+ (not started)

- Level 1 primitives
- Level 2 composites
- Stub component migration (TD-047)

## Related docs

- `docs/architecture/DESIGN_SYSTEM.md`
- `docs/architecture/THEME_ENGINE.md`
- `docs/architecture/RESPONSIVE_DESIGN.md`
- `docs/architecture/ACCESSIBILITY.md`
- `IMPLEMENTATION_STATUS.md`
- ADR-0012
