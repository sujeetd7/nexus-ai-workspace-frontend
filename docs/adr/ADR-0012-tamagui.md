# ADR-0012: Tamagui as the cross-platform UI foundation

- Status: Accepted
- Date: 2026-07-22
- Deciders: Frontend platform

## Context

Sprint 2 requires a shared design-system foundation for React Web and React Native. The monorepo already owns tokens, themes, and stub components in `@nexus/shared-ui`. Sibling repository documentation historically referenced Tailwind CSS and Radix via `@nexus/ui-kit`, which is not an accepted decision in this frontend repository.

## Decision

1. **Tamagui** (`@tamagui/core`, pinned with related `@tamagui/*` packages) is the cross-platform UI foundation for this frontend monorepo.
2. **`@nexus/shared-ui`** remains the sole shared UI ownership boundary for tokens, themes, Tamagui configuration, providers, and future Level 1/2 components.
3. Design tokens have **one source of truth**: existing modules under `packages/shared-ui/src/theme/*` (plus responsive breakpoints). Tamagui configuration maps those values and must not duplicate literals or introduce a second token source.
4. Applications consume a centralized **`SharedUIProvider`** from `@nexus/shared-ui`. Applications must **not** instantiate or import `TamaguiProvider` directly.
5. **Tailwind CSS, Radix UI, and `@nexus/ui-kit` are excluded** as UI foundations for this frontend repository. Sibling docs that mention them do not apply here.
6. Existing stub components are **not** migrated in Batch 2.1. Component migration and Storybook remain deferred (see ADR-0010 / TD-002).

## Consequences

- Web requires React Native Web and a minimal Tamagui Vite integration for foundation setup.
- Mobile depends on `@nexus/shared-ui` and wraps app content with `SharedUIProvider` under the existing `SafeAreaProvider`.
- Compiler extraction / Metro plugin optimization is deferred unless required for correctness.
- Portal, toast, icon, and motion systems are out of scope until justified by consumers.
- ESLint on web restricts direct `TamaguiProvider` imports; mobile enforcement is documented for a later governance pass (mobile uses isolated RN ESLint).

## Related

- Package ownership: `docs/sprint-0/package-ownership-matrix.md`
- Design system: `docs/architecture/DESIGN_SYSTEM.md`
- Dependency rules: `docs/architecture/dependency-rules.md`
- Storybook deferral: `docs/adr/ADR-0010-storybook-deferred.md`
