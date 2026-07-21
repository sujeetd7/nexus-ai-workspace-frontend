# Dependency Graph

```text
                    ┌─────────────┐
                    │  apps/web   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ apps/mobile │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌────────────────────┐
│ @nexus/shared │  │ @nexus/shared │  │ @nexus/shared-     │
│      -ui      │  │  -validation  │  │      network       │
└───────┬───────┘  └───────┬───────┘  └─────────┬──────────┘
        │                  │                    │
        └────────────┬─────┴────────────────────┘
                     ▼
            ┌────────────────┐
            │ @nexus/shared- │
            │     types      │
            └────────────────┘
                     ▲
                     │
            ┌────────────────┐
            │ @nexus/shared- │
            │     utils      │
            └────────────────┘
```

Rules of thumb:

1. Apps depend on packages; packages never depend on apps.
2. Only `@nexus/shared-network` owns Axios transport.
3. Import packages through public entrypoints only.

See `docs/architecture/dependency-rules.md` for enforcement details.
