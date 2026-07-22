# Logging Platform

Canonical guidance for Sprint 1 Batch 1.7 logging platform.

## Purpose

Provide a reusable, security-focused logging foundation:

- Existing `Logger` contract in `@nexus/shared-types` (unchanged)
- Shared helpers in `@nexus/shared-utils`
- Application-local Web and Mobile adapters
- Network transport logging retained in `@nexus/shared-network` with redaction

This batch does **not** claim production observability, remote sinks, analytics, or tracing.

## Existing contract

`Logger` in `@nexus/shared-types` is **frozen** for this batch:

```ts
export interface Logger {
  debug(message: string, metadata?: unknown): void;
  info(message: string, metadata?: unknown): void;
  warn(message: string, metadata?: unknown): void;
  error(message: string, metadata?: unknown): void;
}
```

Do not add `LogLevel`, sink, context, correlation, or telemetry contracts to `shared-types` without an ADR.

## Ownership

| Concern                                                                                      | Owner                                                      |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `Logger` contract                                                                            | `@nexus/shared-types` (unchanged)                          |
| Console / noop / memory / scoped helpers, `logAppError`, metadata sanitization, level policy | `@nexus/shared-utils`                                      |
| `NetworkLogger`, `redactSensitive`, transport request/error logs                             | `@nexus/shared-network`                                    |
| Web adapter + NetworkLogger adapter + client wiring + ErrorBoundary                          | `apps/web` (`src/platform/logging`, `src/api`, components) |
| Mobile adapter                                                                               | `apps/mobile` (`src/platform/logging`)                     |
| Remote sinks / telemetry / analytics / performance pipelines                                 | Deferred                                                   |

## Shared utilities

Public helpers:

- `createConsoleLogger(options?)` — injectable sink, allowed levels, optional scope
- `createNoopLogger()` — immutable no-op
- `createMemoryLogger(options?)` — **test-only**, bounded, non-persistent
- `createScopedLogger(logger, scope)` — `[scope]` message prefix; nested scopes use `/`
- `logAppError(logger, error, message?)` — Batch 1.2 `serializeAppError` / `toAppError`
- `resolveAllowedLogLevels(isDevelopment)` — single level policy for adapters

### Log-level policy

| Mode                                                | Allowed levels             |
| --------------------------------------------------- | -------------------------- |
| Development (`isDevelopment === true`)              | debug, info, warn, error   |
| Production / non-development                        | warn, error                |
| Test (`buildMode === "test"` without injected sink) | noop (Web/Mobile adapters) |

Policy is implemented once in shared-utils and reused by Web and Mobile.

### Scope format

- Trim whitespace
- Empty scope → return parent logger unchanged
- Separator: `/`
- Nested: `createScopedLogger(createScopedLogger(logger, "auth"), "session")` → `[auth/session] …`
- Prefer scope in the message prefix only (not duplicated into metadata)

### Metadata sanitization

Internal recursive sanitizer (not a second network redaction module).

**Limits:**

- Max depth: `6` (`LOG_METADATA_MAX_DEPTH`)
- Max object keys: `40`
- Max array length: `40`

**Sensitive keys** (case-insensitive / normalized): authorization, proxy-authorization, token, accessToken, refreshToken, idToken, password, passcode, secret, apiKey, clientSecret, cookie, set-cookie, session, sessionId, credential(s), privateKey.

Replacement: `[REDACTED]`

Safe placeholders include `[Circular]`, `[Function]`, `[Symbol]`, `[BigInt]`, `[NaN]`, `[Infinity]`, `[MaxDepth]`, `[Unsupported]`, `[GetterError]`.

Error objects log `name` + `message` only — never stack or cause.

Logging must never throw because metadata cannot be inspected.

### Never-throws guarantee

Every logger method swallows failures from sanitization, console/sink invocation, scope composition, and memory capture. Do not recursively log logger failures.

### AppError logging

`logAppError` logs only serialized safe fields (`code`, `message`, `name`, `retryable`, sanitized metadata). No Result success logging helpers.

## NetworkLogger distinction

`NetworkLogger` is transport-scoped and optional-method shaped. It remains in `@nexus/shared-network`.

`Logger → NetworkLogger` conversion is **application-local** (`createNetworkLoggerAdapter`). Do not import `@nexus/shared-utils` into `@nexus/shared-network`. Do not move `redactSensitive`.

Network redaction owns request/header/body secret keys for transport logs. Shared-utils sanitization owns general application log metadata.

## Web adapter

`apps/web/src/platform/logging`:

- `createWebLogger` — validated `env` / injected config; reuses `createConsoleLogger`
- `createNetworkLoggerAdapter` / `createGraphQLNetworkLoggerAdapter`
- `webLogger` singleton for app modules

REST and GraphQL `createHttpClient` calls pass the network adapters. GraphQL adapter strips `query` and `variables` from logged `data` while allowing `operationName`.

Compatibility: `apps/web/src/api/observability/logger.ts` re-exports `webLogger` as `logger` (pending removal — TD-040).

### ErrorBoundary

Uses `logAppError` via the platform logger. Forbidden: stack, cause, React `componentStack` / full `ErrorInfo`, props, state.

## Mobile adapter

`apps/mobile/src/platform/logging`:

- `createMobileLogger` — validated mobile env; same level policy
- No native logging library, remote sink, or HTTP client wiring (no mobile network client yet)

## Forbidden data

Do not log:

- Tokens, authorization headers, cookies
- Passwords / secrets / API keys
- Stack traces / Error causes
- React component stacks
- GraphQL query text or variables
- Raw request/response payloads outside network-owned redacted summaries

## Generator decision

No `gen:logger`. Logging is security-sensitive infrastructure with two app adapters — generator maintenance exceeds savings.

## Deferred / ADR triggers

Deferred: remote observability sinks, correlation/tracing, performance metrics pipeline, request-id consolidation, mobile network-client logging, compatibility-wrapper removal.

Raise an ADR before:

- Changing the public `Logger` or `NetworkLogger` contracts
- Creating `@nexus/shared-logger`
- Moving redaction out of shared-network
- Adding third-party logging/telemetry dependencies
- Introducing `shared-network → shared-utils`
