# Networking Security Checklist

## Tokens

- [x] Authorization header adapter exists
- [x] Token clearing exists
- [x] Tokens are never logged
- [x] Token redaction is applied in observability
- [x] Refresh token is not exposed to unrelated modules (storage adapter only)
- [x] Browser storage risk is documented (`docs/sprint-0/browser-token-storage.md`)
- [ ] Mobile tokens use secure platform storage

## Refresh Flow

- [ ] Single-flight refresh concurrency
- [ ] Failed-request replay
- [ ] Refresh recursion prevention
- [ ] Refresh-token rotation support
- [ ] Replay detection handling
- [ ] Session invalidation callback

## Retries

- [x] Maximum retry count enforced
- [x] Exponential backoff
- [x] Jitter
- [x] Non-idempotent requests excluded by default
- [x] 401 refresh flow separated from generic retries (401/403 never auto-retried)

## Interceptors

- [x] Request interceptor exists
- [x] Authorization interceptor exists
- [x] Response interceptor exists
- [x] Error interceptor exists
- [x] Interceptor registration is idempotent
- [x] Interceptor IDs can be ejected in tests/hot reload
- [x] Duplicate interceptor registration is prevented

## Storage

- [x] Browser token storage adapter is isolated
- [ ] Production browser strategy reviewed against XSS threat model
- [ ] Secure cookie option evaluated
- [ ] Mobile secure storage implemented
- [ ] Storage failures handled

## GraphQL

- [x] Separate GraphQL client exists
- [x] GraphQL base query exists
- [x] GraphQL `errors[]` normalized into the common error model
- [x] Partial-data behavior documented (fail closed; opt-in `allowPartialData`)
- [x] Sensitive query variables are not logged (request logs are redacted)

## Cancellation

- [x] AbortSignal support
- [x] RTK Query cancellation forwarded to Axios
- [ ] Streaming cancellation support
- [ ] Unmounted requests are canceled where needed

## Logging

- [x] No logging is required for token storage
- [x] Authorization headers redacted
- [x] Cookies redacted
- [x] Sensitive request bodies redacted
- [x] Password and reset-token fields redacted
- [x] Production logs exclude raw Axios errors when sensitive data may exist

## Idempotency

- [x] Safe methods only are retried by default
- [x] Opt-in `Idempotency-Key` via `idempotent: true` (or pre-set header)

## Result

Status: Shared-network hardening for Sprint 0 is complete for retries, redaction, interceptor lifecycle, GraphQL error/partial-data policy, and idempotency keys. Auth refresh orchestration and mobile secure storage remain deferred (TD-006 / TD-008).
