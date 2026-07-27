import type {
  CoverageRecord,
  MetricValue,
  TestCaseRecord,
  TestFailureRecord,
  TestStatus,
  TestType,
} from "../schema/quality-report.js";

export interface AdapterResult {
  readonly testCases: readonly TestCaseRecord[];
  readonly coverage: readonly CoverageRecord[];
  readonly failures: readonly TestFailureRecord[];
}

function asMetric(value: unknown): MetricValue {
  return typeof value === "number" && Number.isFinite(value) ? value : "unavailable";
}

function mapStatus(raw: unknown): TestStatus {
  const value = String(raw ?? "unknown").toLowerCase();
  if (value === "pass" || value === "passed") return "passed";
  if (value === "fail" || value === "failed") return "failed";
  if (value === "skip" || value === "skipped" || value === "pending") return "skipped";
  if (value === "todo") return "todo";
  return "unknown";
}

function stableFallbackId(parts: readonly string[]): string {
  return parts
    .map((part) =>
      part
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ".")
        .replace(/^\.+|\.+$/g, ""),
    )
    .filter(Boolean)
    .join(".");
}

function emptyCaseDefaults(
  partial: Omit<TestCaseRecord, "tags" | "requirementIds" | "capabilityIds" | "agentIds" | "skillIds" | "workflowIds" | "mcpToolIds" | "evidenceReferences"> &
    Partial<TestCaseRecord>,
): TestCaseRecord {
  return {
    tags: [],
    requirementIds: [],
    capabilityIds: [],
    agentIds: [],
    skillIds: [],
    workflowIds: [],
    mcpToolIds: [],
    evidenceReferences: [],
    ...partial,
  };
}

/** Vitest JSON reporter + V8/Istanbul coverage summary/json. */
export function adaptVitest(input: {
  readonly repository: string;
  readonly packageName: string;
  readonly resultsJson?: unknown;
  readonly coverageSummary?: unknown;
  readonly application?: string;
  readonly platform?: string;
}): AdapterResult {
  const testCases: TestCaseRecord[] = [];
  const failures: TestFailureRecord[] = [];
  const coverage: CoverageRecord[] = [];

  const results = input.resultsJson as
    | {
        testResults?: Array<{
          name?: string;
          assertionResults?: Array<{
            fullName?: string;
            title?: string;
            status?: string;
            duration?: number;
            ancestorTitles?: string[];
            failureMessages?: string[];
          }>;
        }>;
      }
    | undefined;

  for (const file of results?.testResults ?? []) {
    const testFile = file.name ?? "unknown";
    for (const assertion of file.assertionResults ?? []) {
      const title = assertion.title ?? assertion.fullName ?? "unnamed";
      const suite = (assertion.ancestorTitles ?? []).join(" > ") || "root";
      const status = mapStatus(assertion.status);
      const testId = stableFallbackId([
        input.repository,
        input.packageName,
        testFile,
        suite,
        title,
      ]);
      const record = emptyCaseDefaults({
        testId,
        testIdSource: "generated",
        title,
        suite,
        testType: "unit" as TestType,
        framework: "vitest",
        repository: input.repository,
        packageName: input.packageName,
        application: input.application,
        platform: input.platform,
        testFile,
        status,
        durationMs: assertion.duration,
      });
      testCases.push(record);
      if (status === "failed") {
        failures.push({
          testId,
          title,
          packageName: input.packageName,
          testFile,
          message: assertion.failureMessages?.[0],
          artifactPaths: [],
        });
      }
    }
  }

  const summary = input.coverageSummary as
    | {
        total?: {
          statements?: { pct?: number };
          branches?: { pct?: number };
          functions?: { pct?: number };
          lines?: { pct?: number };
        };
        [path: string]: unknown;
      }
    | undefined;

  if (summary) {
    for (const [filePath, value] of Object.entries(summary)) {
      if (filePath === "total" || typeof value !== "object" || value === null) continue;
      const file = value as {
        statements?: { pct?: number };
        branches?: { pct?: number };
        functions?: { pct?: number };
        lines?: { pct?: number };
        uncoveredLines?: number[];
      };
      coverage.push({
        packageName: input.packageName,
        filePath,
        statementCoverage: asMetric(file.statements?.pct),
        branchCoverage: asMetric(file.branches?.pct),
        functionCoverage: asMetric(file.functions?.pct),
        lineCoverage: asMetric(file.lines?.pct),
        uncoveredLines: file.uncoveredLines ?? [],
        critical: false,
      });
    }
  }

  return { testCases, coverage, failures };
}

/** Jest JSON results + Istanbul coverage-summary.json */
export function adaptJest(input: {
  readonly repository: string;
  readonly packageName: string;
  readonly resultsJson?: unknown;
  readonly coverageSummary?: unknown;
  readonly application?: string;
  readonly platform?: string;
}): AdapterResult {
  const adapted = adaptVitest({ ...input });
  return {
    ...adapted,
    testCases: adapted.testCases.map((test) => ({
      ...test,
      framework: "jest" as const,
    })),
  };
}

/** Playwright JSON reporter output. */
export function adaptPlaywright(input: {
  readonly repository: string;
  readonly packageName: string;
  readonly resultsJson?: unknown;
}): AdapterResult {
  const testCases: TestCaseRecord[] = [];
  const failures: TestFailureRecord[] = [];
  const suites = (input.resultsJson as { suites?: unknown[] } | undefined)?.suites ?? [];

  const walk = (nodes: unknown[], ancestors: string[]): void => {
    for (const node of nodes) {
      const suite = node as {
        title?: string;
        suites?: unknown[];
        specs?: Array<{
          title?: string;
          file?: string;
          tests?: Array<{
            status?: string;
            results?: Array<{
              status?: string;
              duration?: number;
              retry?: number;
              error?: { message?: string };
              attachments?: Array<{ path?: string }>;
            }>;
          }>;
        }>;
      };
      const nextAncestors = suite.title ? [...ancestors, suite.title] : ancestors;
      if (suite.suites?.length) walk(suite.suites, nextAncestors);
      for (const spec of suite.specs ?? []) {
        for (const test of spec.tests ?? []) {
          const result = test.results?.[test.results.length - 1];
          const retryCount = Math.max(0, (test.results?.length ?? 1) - 1);
          const rawStatus = result?.status ?? test.status;
          let status = mapStatus(rawStatus);
          if (status === "passed" && retryCount > 0) status = "flaky";
          const title = spec.title ?? "unnamed";
          const suiteName = nextAncestors.join(" > ") || "root";
          const testFile = spec.file ?? "unknown";
          const testId = stableFallbackId([
            input.repository,
            input.packageName,
            testFile,
            suiteName,
            title,
          ]);
          testCases.push(
            emptyCaseDefaults({
              testId,
              testIdSource: "generated",
              title,
              suite: suiteName,
              testType: "e2e",
              framework: "playwright",
              repository: input.repository,
              packageName: input.packageName,
              testFile,
              status,
              durationMs: result?.duration,
              retryCount,
            }),
          );
          if (status === "failed") {
            failures.push({
              testId,
              title,
              packageName: input.packageName,
              testFile,
              message: result?.error?.message,
              retryCount,
              artifactPaths: (result?.attachments ?? [])
                .map((a) => a.path)
                .filter((p): p is string => Boolean(p)),
            });
          }
        }
      }
    }
  };

  walk(suites, []);
  return { testCases, coverage: [], failures };
}

/** Storybook interaction / a11y JSON (optional). */
export function adaptStorybook(input: {
  readonly repository: string;
  readonly packageName: string;
  readonly resultsJson?: unknown;
}): AdapterResult {
  const stories =
    (
      input.resultsJson as
        | {
            results?: Array<{
              storyId?: string;
              title?: string;
              component?: string;
              interactionStatus?: string;
              accessibilityStatus?: string;
              file?: string;
            }>;
          }
        | undefined
    )?.results ?? [];

  const testCases: TestCaseRecord[] = stories.map((story) => {
    const interaction = mapStatus(story.interactionStatus ?? "unknown");
    const a11y = mapStatus(story.accessibilityStatus ?? "unknown");
    const status: TestStatus =
      interaction === "failed" || a11y === "failed"
        ? "failed"
        : interaction === "passed" && a11y === "passed"
          ? "passed"
          : "unknown";
    const title = story.title ?? story.storyId ?? "story";
    const testFile = story.file ?? "unknown";
    return emptyCaseDefaults({
      testId: stableFallbackId([
        input.repository,
        input.packageName,
        "storybook",
        story.storyId ?? title,
      ]),
      testIdSource: "generated",
      title,
      suite: story.component ?? "storybook",
      testType: "component",
      framework: "storybook",
      repository: input.repository,
      packageName: input.packageName,
      testFile,
      status,
      tags: ["storybook"],
    });
  });

  const failures = testCases
    .filter((t) => t.status === "failed")
    .map((t) => ({
      testId: t.testId,
      title: t.title,
      packageName: t.packageName,
      testFile: t.testFile,
      artifactPaths: [] as string[],
    }));

  return { testCases, coverage: [], failures };
}

export function unavailableMetric(): MetricValue {
  return "unavailable";
}
