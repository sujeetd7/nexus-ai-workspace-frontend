# Coverage Governance (Frontend)

Thresholds: `quality/quality.config.json`

Policy layers: baseline → no-regression → target → critical-file.

Missing metrics must remain `unavailable`.

Jest CI already can emit html/lcov via `testing/presets/jest.base.cjs` when `CI=true`. Vitest packages support coverage when `QUALITY_COVERAGE=1`.
