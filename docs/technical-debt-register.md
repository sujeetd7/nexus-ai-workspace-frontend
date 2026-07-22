# Technical Debt Register

| ID     | Area              | Debt                                                                                                                                | Risk   | Priority | Target                                 |
| ------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------ | -------- | -------------------------------------- |
| TD-001 | Shared packages   | Some packages currently have minimal or no runtime tests                                                                            | Medium | Medium   | Sprint 1â€“2                           |
| TD-002 | Storybook         | Shared UI has no interactive component documentation                                                                                | Medium | Medium   | Design-system sprint                   |
| TD-003 | SonarQube         | Root `sonar-project.properties` exists; hosted scanner, token, and CI step are deferred (see `docs/sprint-0/sonarqube-baseline.md`) | Medium | Medium   | CI hardening sprint                    |
| TD-004 | Android release   | APK/AAB automation is not implemented                                                                                               | Medium | Medium   | Release engineering sprint             |
| TD-005 | Web deployment    | Production web deployment is not implemented                                                                                        | Medium | Medium   | Release engineering sprint             |
| TD-006 | Networking        | Refresh-token single-flight and request replay are deferred                                                                         | High   | High     | Authentication sprint                  |
| TD-007 | Networking        | Browser localStorage is not appropriate for all security contexts                                                                   | High   | High     | Authentication/security sprint         |
| TD-008 | Mobile security   | Secure credential storage is not implemented                                                                                        | High   | High     | Mobile authentication sprint           |
| TD-009 | Streaming         | Streaming client remains deferred                                                                                                   | Low    | Low      | AI/chat sprint                         |
| TD-010 | Offline           | Offline manager remains incomplete                                                                                                  | Medium | Low      | Mobile resilience sprint               |
| TD-011 | CI supply chain   | GitHub Actions use version tags instead of immutable commit SHAs                                                                    | Medium | Medium   | CI security hardening                  |
| TD-012 | Microfrontends    | Existing `*-mf` applications require evidence-based justification                                                                   | High   | High     | Sprint 0 closure                       |
| TD-013 | Package ownership | `shared-theme`, `shared-ui`, and `ui-kit` ownership may overlap                                                                     | High   | High     | Sprint 0 closure                       |
| TD-014 | Empty scaffolding | `.gitkeep`-only directories may communicate speculative architecture                                                                | Low    | Medium   | Sprint 0 closure                       |
| TD-015 | Branch protection | Private-repo GitHub plan returns HTTP 403 for rulesets/branch protection APIs; in-repo ruleset JSON is ready to apply               | High   | High     | Enable when plan allows / org rulesets |
| TD-016 | Mobile env inject | React Native has no approved native env injection (`react-native-config` / Gradle / Xcode); typed `publicConfig.ts` is temporary    | Medium | Medium   | Requires ADR before native injector    |
| TD-017 | Deploy env names  | Deployment stages (local/staging/preproduction) are not modeled; only Vite/RN build modes exist                                     | Low    | Low      | When multi-stage deploy lands          |
| TD-018 | CI runtime env    | Quality CI does not smoke-test runtime public configuration with injected `VITE_*` values                                           | Low    | Low      | Release / e2e hardening                |
| TD-019 | App version src   | Web `APP.VERSION` remains hardcoded in `constants.ts` rather than a single shared version source                                    | Low    | Low      | Versioning / release batch             |
| TD-020 | Validation forms  | React Hook Form ↔ Zod adapter is deferred; form integration must not live in `@nexus/shared-validation`                             | Medium | Medium   | Future adapter layer batch             |
| TD-021 | Feature schemas   | Feature/form/auth/AI schemas remain with feature owners; placement guidance is docs-only until consumers appear                     | Medium | Medium   | When first feature schemas land        |
| TD-022 | Validation i18n   | Shared validation messages are English fixed strings; localized messages are deferred                                               | Low    | Low      | i18n sprint                            |
| TD-023 | API DTO validate  | API response runtime Zod validation at network/DTO boundaries is deferred                                                           | Medium | Medium   | Networking / DTO validation batch      |
| TD-024 | Validation Jest   | Leftover `packages/shared-validation/jest.config.cjs` is unused after Vitest migration                                              | Low    | Low      | Package cleanup pass                   |

## Review Policy

- Review this register at the beginning and end of every sprint.
- Security-related debt cannot be deferred without explicit approval.
- New debt must include an owner and target sprint.
