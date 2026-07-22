# Provider Composition

Sprint 3 Batch 3.2 provider trees. Count includes actual React context providers only (not ErrorBoundary, Suspense, or ordinary wrappers).

## Web (ready path)

```text
ErrorBoundary                    (application-owned; not a context provider)
  └── Suspense                   (not a context provider)
        └── SharedUIProvider
              ├── TamaguiProvider
              ├── ThemeProvider
              └── Theme (bridge)
                    └── Redux Provider
                          └── BrowserRouter
                                └── existing catch-all routes
```

**Context provider depth:** 5 (TamaguiProvider, ThemeProvider, Theme, Redux, BrowserRouter) — under the limit of 8.

SharedUIProvider is the sole design-system entry. Applications must not mount `TamaguiProvider` / `ThemeProvider` directly.

During initializing/failed states, a temporary SharedUIProvider wraps startup loading/failure UI only — never stacked with the ready-tree SharedUIProvider.

## Mobile (ready path)

```text
ErrorBoundary
  └── Suspense
        └── SafeAreaProvider
              └── SharedUIProvider
                    ├── TamaguiProvider
                    ├── ThemeProvider
                    └── Theme
                          └── Redux Provider
                                └── temporary template content
```

**Context provider depth:** 5 (SafeArea, Tamagui, ThemeProvider, Theme, Redux).

NavigationContainer is **not** mounted (Batch 3.3).

## Rules

- No duplicate SharedUIProvider in one tree
- RTK Query uses Redux — no separate RTK provider
- No GraphQL React provider
- No AI / MCP / Tool / Agent providers
- Future Sprint 4 providers (if approved) should insert **above** the application shell and **below** Redux only when justified, remaining ≤ 8 total

## Extension point (documentation only)

```text
… Redux Provider
     └── [future approved capability providers — none in Sprint 3]
           └── Router / Navigation
                 └── Application Shell
```
