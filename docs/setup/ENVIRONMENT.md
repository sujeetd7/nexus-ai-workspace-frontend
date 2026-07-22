# Environment Platform

Canonical guidance for Sprint 1 Batch 1.3 public client configuration.

## Architecture

```text
apps/web, apps/mobile
        │  (thin adapters)
        ▼
@nexus/shared-validation   (Zod schema + parsePublicClientConfig via parseWithSchema)
        │
        └── @nexus/shared-types   (BuildMode, PublicClientConfig, Result, AppError)
```

No `@nexus/shared-environment` (or similar) package exists or is approved.

## Public versus secret configuration

**Public (allowed in Web / React Native):**

- Build mode
- Public API base URL
- Public GraphQL URL
- Application display name
- Derived `isDevelopment` / `isProduction`

**Forbidden in client apps:**

- Private API keys, database credentials, JWT signing secrets
- OAuth client secrets, SMTP credentials, encryption keys
- Infrastructure tokens and server-only secrets

Client-bundled values are visible to end users. Masking is not a security control.

## Supported build modes

- `development`
- `test`
- `production`

Deployment stages (`local`, `staging`, `preproduction`) are **not** part of this contract.

## Shared contract

`PublicClientConfig` in `@nexus/shared-types`:

- `buildMode`
- `apiBaseUrl`
- `graphqlUrl`
- `appName`
- `isDevelopment` (derived)
- `isProduction` (derived)

## Shared validation flow

`parsePublicClientConfig(input)` in `@nexus/shared-validation`:

1. Accept a plain object only (no env globals)
2. Parse and validate (`buildMode`, absolute `http(s)` URLs, optional `appName`) using shared primitives (`buildModeSchema`, `absoluteHttpUrlSchema`)
3. Default / trim `appName`
4. Derive development / production flags
5. Freeze the result
6. Return `Result<PublicClientConfig, AppError>` via `parseWithSchema` with `ERROR_CODES.CONFIGURATION` on failure

Unknown fields are rejected. Error metadata may include safe field names and issue categories only — never URLs, raw input, tokens, or Zod values.

Shared validation platform details: `docs/architecture/VALIDATION_PLATFORM.md`.

## Web adapter flow

Approved reader: `apps/web/src/config/env.ts`

| Vite variable      | Shared field |
| ------------------ | ------------ |
| `VITE_API_URL`     | `apiBaseUrl` |
| `VITE_GRAPHQL_URL` | `graphqlUrl` |
| `VITE_APP_NAME`    | `appName`    |
| `MODE`             | `buildMode`  |

Parse once at module load. Fail fast on invalid configuration. Export only the frozen config. `apps/web/src/config/api.ts` continues to expose `baseUrl` / `graphql` from the validated contract.

## React Native adapter flow

Approved adapter: `apps/mobile/src/config/env.ts`
Typed source: `apps/mobile/src/config/publicConfig.ts`

There is **no** native `.env` injection today. `apps/mobile/.env.example` is reference documentation only.

## Parse-once / freeze-once policy

Adapters call `parsePublicClientConfig` once and export the frozen object. Do not re-parse in features. Do not mutate configuration.

## Direct-access policy

Runtime application configuration may read environment globals only in:

- `apps/web/src/config/env.ts` (`import.meta.env`)
- the React Native typed source + adapter (no `process.env` / `import.meta.env` for app config)

Tooling (Jest coverage, Xcode `NODE_BINARY`, CI) may use `process.env` as appropriate.

Feature, domain, repository, Redux, logging consumers, and shared packages must consume validated configuration — not raw env globals.

## Example files

| File                       | Role                                    |
| -------------------------- | --------------------------------------- |
| `apps/web/.env.example`    | Canonical Web public variables          |
| `apps/mobile/.env.example` | Mobile field documentation (not loaded) |
| `.env.example`             | Repository guidance and pointers only   |

## CI behavior

The quality workflow does not inject `VITE_*` secrets. Vite **build** transforms without executing adapter fail-fast. Runtime / Vitest use documented public values (see Web Vitest `test.env` in `apps/web/vite.config.ts`).

## Testing

- Schema tests: `@nexus/shared-validation`
- Web adapter + logger: Vitest under `apps/web`
- Mobile adapter: Jest under `apps/mobile/__tests__`

## Troubleshooting

| Symptom                                             | Likely cause                                    |
| --------------------------------------------------- | ----------------------------------------------- |
| `Invalid public client configuration.` on Web start | Missing/invalid `VITE_*` or unsupported `MODE`  |
| Relative URL rejected                               | Use absolute `http://` or `https://` URLs       |
| Mobile config drift                                 | Update `publicConfig.ts` (`.env` is not loaded) |

## Future native injection

Any `react-native-config` (or Gradle/Xcode env injection) requires an ADR and CTO approval. Do not add native env libraries in application batches without that decision.
