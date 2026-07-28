# Sprint 5 — Mobile Authentication Parity (Batch 5.DS.6)

Bring React Native authentication to feature parity with the completed Web auth experience (5.DS.5). No shared-ui expansion. No backend changes.

## Repository audit

| Screen                 | Pre-batch | Post-batch | Notes                                                                          |
| ---------------------- | --------- | ---------- | ------------------------------------------------------------------------------ |
| Login                  | Partial   | Complete   | AuthShell/AuthCard; links to Register / Forgot Password; classified API errors |
| Register               | Missing   | Complete   | Backend fields only: email, password, optional firstName/lastName              |
| Forgot Password        | Missing   | Complete   | Loading / success / retry / API failure                                        |
| Reset Password         | Missing   | Complete   | Token from route params; confirm password client-side; invalid/expired         |
| Verify Email           | Missing   | Complete   | Auto-verify on mount; loading / success / invalid / expired / retry            |
| Auth bootstrap loading | Complete  | Unchanged  | `AuthLoadingScreen` in RootNavigator                                           |

## Composition contract

Screens compose: `AuthShell` (via `AuthScreenLayout`), `AuthCard`, `AuthFooter`, `FormField` (+ PasswordField via `secureTextEntry`), `InlineAlert`, `Button`, `Link`, `Loader`, `Stack`, `Text`.

Brand slot: **Nexus AI Workspace**.

Mobile chrome (`AuthScreenLayout`): `KeyboardAvoidingView`, safe-area insets, `ScrollView`, keyboard dismiss on drag/tap.

## Backend contracts (unchanged)

| Flow            | Client                      | Session                   |
| --------------- | --------------------------- | ------------------------- |
| Login           | `AuthClient.login`          | `SessionManager.login`    |
| Register        | `AuthClient.register`       | `SessionManager.register` |
| Forgot Password | `AuthClient.forgotPassword` | —                         |
| Reset Password  | `AuthClient.resetPassword`  | —                         |
| Verify Email    | `AuthClient.verifyEmail`    | —                         |

No OAuth, biometrics, remember-me, or invented resend UI.

## Navigation

Unauthenticated stack screens: Login, Register, ForgotPassword, ResetPassword, VerifyEmail.

Deep-link path shapes (prefixes still empty — no invented production scheme):

- `login`, `register`, `forgot-password`
- `reset-password?token=` / `verify-email?token=` via linking parse

## Accessibility

- Labels/hints on primary actions and footer links
- `AccessibilityInfo.announceForAccessibility` after validation and API status
- InlineAlert uses existing alert semantics for error/warning/success
- FormField surfaces validation via `errorText` → accessibility hint

## Deferred

- Return-key field chaining (`returnKeyType` / `onSubmitEditing`) — not exposed on shared-ui `FormField`/`Input` (no shared-ui changes in this batch)
- Production deep-link scheme / universal links (prefixes remain empty)
- RN Storybook infrastructure (not created; web auth stories unchanged)
- `authResendVerification` product UI (client exists; no invented resend flow)

## Tests

- `apps/mobile/__tests__/AuthScreens.test.tsx`
- `apps/mobile/__tests__/authErrorPresentation.test.ts`
- `apps/mobile/__tests__/navigation.test.ts` (auth routes + linking)

## Related (Batch 5.DS.7)

System Session Expired / bootstrap failure gates live in `RootNavigator` — see `docs/sprint-5/SYSTEM_AUTH_FAILURE_UX.md`. Auth forms are unchanged.
