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

## Review Policy

- Review this register at the beginning and end of every sprint.
- Security-related debt cannot be deferred without explicit approval.
- New debt must include an owner and target sprint.
