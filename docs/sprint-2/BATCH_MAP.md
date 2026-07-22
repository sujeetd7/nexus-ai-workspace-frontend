# Sprint 2 Batch Map

Canonical scope map for Sprint 2 design-system work. Batch 2.2 absorbed the theme-engine work originally anticipated later; **do not reimplement theme switching, persistence, or Tamagui theme sync in Batch 2.3**.

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

## Batch 2.3 — Remaining scope

- Responsive foundation (breakpoint / media-query governance beyond current mapping)
- Accessibility foundation
- WCAG AA readiness
- Keyboard and focus strategy
- Screen-reader conventions
- Color-contrast validation
- Reduced-motion readiness
- React Native touch-target requirements

**Out of Batch 2.3:** primitive/composite component implementation, Storybook, product/feature UI.

## Batch 2.4+ (not started)

- Level 1 primitives
- Level 2 composites
- Stub component migration (TD-047)

## Related docs

- `docs/architecture/DESIGN_SYSTEM.md`
- `docs/architecture/THEME_ENGINE.md`
- `IMPLEMENTATION_STATUS.md`
- ADR-0012
