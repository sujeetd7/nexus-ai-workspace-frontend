# Frontend API Contract Sync (W5)

Gateway OpenAPI is the contract source of truth for frontend Auth wiring.

## Flow

```text
http://localhost:3000/docs/json
  → pnpm contract:sync (snapshot + drift metadata)
  → packages/shared-types/src/auth (curated types)
  → @nexus/shared-validation/src/auth (form schemas)
  → @nexus/shared-utils auth client
```

## Rules

- No runtime Swagger fetch at app startup.
- No microservice base URLs in frontend contracts.
- Admin, Analytics, and Notification operations are excluded.
- Curated types in `@nexus/shared-types` remain authoritative over generated stubs.
- Drift metadata is stored in `quality/contracts/gateway-openapi.snapshot.json`.

## Commands

```powershell
pnpm contract:sync
```

This fetches the Gateway OpenAPI document when available and updates the checked snapshot metadata. Type curation is manual and reviewed per batch.

## Gateway base URL

- Web: `VITE_API_URL` (default `http://localhost:3000/api/v1`)
- Mobile: `apps/mobile/src/config/publicConfig.ts`

Auth client paths are relative (`/auth/*`) under the Gateway `/api/v1` prefix.
