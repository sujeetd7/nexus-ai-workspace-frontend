# Result and Application Error Platform

Canonical guidance for Sprint 1 Batch 1.2 Result and error contracts.

## Ownership

| Concern                                                                | Package                 | Notes                                  |
| ---------------------------------------------------------------------- | ----------------------- | -------------------------------------- |
| `Result` / `Ok` / `Err`, `AppError`, `ErrorCode`, `SerializedAppError` | `@nexus/shared-types`   | Type contracts (+ `ERROR_CODES` const) |
| Result helpers, `normalizeError`, factories, serialization             | `@nexus/shared-utils`   | Framework-independent runtime          |
| `ApiError`, `normalizeApiError`, `apiErrorToAppError`                  | `@nexus/shared-network` | Network-specific only                  |

## Result usage

```ts
import {
  andThen,
  fromPromise,
  ok,
  err,
  matchResult,
} from "@nexus/shared-utils";

const result = await fromPromise(loadUser(id));
const next = andThen(result, (user) => ok(user.email));
const label = matchResult(next, {
  ok: (email) => email,
  err: (error) => error.message,
});
```

Prefer `Result` for recoverable domain/application failures. Keep transport failures as `ApiError` until an explicit conversion boundary.

## Error codes

Use `ERROR_CODES` / `ErrorCode` from `@nexus/shared-types`.

Allowed categories: `UNKNOWN`, `VALIDATION`, `NETWORK`, `TIMEOUT`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `STORAGE`, `CONFIGURATION`, `INTERNAL`.

Do not add feature-specific codes to shared packages.
Do not treat HTTP status as the only classification — status may appear only as safe metadata after conversion.

## Normalization policy

- Use `normalizeError` / `toAppError` for unknown thrown values.
- Existing `AppError` values are preserved (default code filled when missing).
- Native `Error`, strings, primitives, `null`, and `undefined` are converted safely.
- Arbitrary object fields are never copied into metadata.

## Serialization and redaction

`serializeAppError` returns `SerializedAppError` with:

- `code`, `message`
- optional `name`, `retryable`, sanitized `metadata`

Excluded by default:

- `cause`
- stack traces
- nested objects / arrays
- tokens, secrets, and raw response bodies

## Shared versus network-specific errors

- `AppError` is the shared application contract.
- `ApiError` remains the HTTP/GraphQL transport error.
- Convert with `apiErrorToAppError` at service/repository boundaries.
- Do not replace `normalizeApiError` or Axios interceptors in this platform layer.

## Anti-patterns

- Parallel Result or AppError types in apps/features
- Deep imports from `@nexus/*/src/...`
- Putting Axios types into `@nexus/shared-types`
- Logging serialized errors that include raw causes
- UI toasts/hooks/Redux wired into shared-utils

## Migration notes

1. Keep using `ApiError` inside networking adapters.
2. At non-network boundaries, call `apiErrorToAppError` then `serializeAppError` / Result helpers as needed.
3. Web `apps/web/src/api/errors` re-exports remain valid; migrate consumers gradually.
4. React Native has no shared AppError usage yet — adopt shared-utils when storage/services land.

## Validation errors (Batch 1.4)

Use `parseWithSchema` from `@nexus/shared-validation` for Zod → `Result<T, AppError>` mapping.

- Default code: `ERROR_CODES.VALIDATION`
- Configuration boundaries may pass `ERROR_CODES.CONFIGURATION`
- Safe metadata only: field path heads, issue categories, issue counts
- See `docs/architecture/VALIDATION_PLATFORM.md`

## Logging serialized errors (Batch 1.7)

Prefer `logAppError` from `@nexus/shared-utils` when writing AppErrors to a `Logger`.

- Uses `toAppError` + `serializeAppError`
- Never logs `cause`, stack traces, or raw payloads
- Application log metadata sanitization is separate from network `redactSensitive`
- See `docs/architecture/LOGGING_PLATFORM.md`

## Deferred

- React Hook Form ↔ Zod adapter (outside shared-validation)
- Feature/form schema ownership enforcement beyond documentation
- Refresh-token orchestration mapping
- Telemetry / remote logging sinks
- Secure mobile storage adapters
- Automatic interceptor conversion of all Axios failures to `AppError`

## Environment configuration errors (Batch 1.3)

Invalid public client configuration uses `ERROR_CODES.CONFIGURATION` via `parsePublicClientConfig` (implemented with `parseWithSchema`).

Safe metadata may include field names, issue categories, and issue counts only.

Do not place URLs, raw input objects, tokens, secrets, stack traces, or Zod issue objects that echo original values into `AppError` message/metadata.
