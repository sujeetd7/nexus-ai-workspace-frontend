import type {
  CoverageRecord,
  MetricValue,
  PackageQualityReport,
  QualityReport,
  QualitySummary,
  RepositoryIdentity,
  TestCaseRecord,
  TestFailureRecord,
  TestMappingRecord,
  RequirementRecord,
  QUALITY_REPORT_SCHEMA_VERSION,
} from "../schema/quality-report.js";
import { QUALITY_REPORT_SCHEMA_VERSION as SCHEMA } from "../schema/quality-report.js";

function sortById<T extends { testId?: string; filePath?: string; packageName?: string; targetId?: string; id?: string; path?: string }>(
  items: readonly T[],
  key: keyof T,
): T[] {
  return [...items].sort((a, b) => String(a[key]).localeCompare(String(b[key])));
}

function averageMetric(values: readonly MetricValue[]): MetricValue {
  const nums = values.filter((v): v is number => typeof v === "number");
  if (nums.length === 0) return "unavailable";
  return Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2));
}

export function buildSummary(
  testCases: readonly TestCaseRecord[],
  coverage: readonly CoverageRecord[],
  packageReports: readonly PackageQualityReport[],
): QualitySummary {
  const count = (status: TestCaseRecord["status"]) =>
    testCases.filter((t) => t.status === status).length;

  const coveredFiles =
    coverage.length === 0
      ? ("unavailable" as const)
      : coverage.filter((c) => typeof c.lineCoverage === "number" && c.lineCoverage > 0).length;
  const uncoveredFiles =
    coverage.length === 0
      ? ("unavailable" as const)
      : coverage.filter((c) => c.lineCoverage === 0 || c.lineCoverage === "unavailable").length;

  const thresholdEvaluated = packageReports.filter((p) => p.thresholdStatus !== "unavailable");

  return {
    totalTests: testCases.length,
    passedTests: count("passed"),
    failedTests: count("failed"),
    skippedTests: count("skipped"),
    todoTests: count("todo"),
    flakyTests: count("flaky"),
    quarantinedTests: count("quarantined"),
    statementCoverage: averageMetric(coverage.map((c) => c.statementCoverage)),
    branchCoverage: averageMetric(coverage.map((c) => c.branchCoverage)),
    functionCoverage: averageMetric(coverage.map((c) => c.functionCoverage)),
    lineCoverage: averageMetric(coverage.map((c) => c.lineCoverage)),
    coveredFiles,
    uncoveredFiles,
    packagesPassingThreshold:
      thresholdEvaluated.length === 0
        ? "unavailable"
        : thresholdEvaluated.filter((p) => p.thresholdStatus === "pass").length,
    packagesFailingThreshold:
      thresholdEvaluated.length === 0
        ? "unavailable"
        : thresholdEvaluated.filter((p) => p.thresholdStatus === "fail").length,
  };
}

export function buildPackageReports(
  testCases: readonly TestCaseRecord[],
  coverage: readonly CoverageRecord[],
): PackageQualityReport[] {
  const packages = new Set<string>([
    ...testCases.map((t) => t.packageName),
    ...coverage.map((c) => c.packageName),
  ]);

  return [...packages]
    .sort((a, b) => a.localeCompare(b))
    .map((packageName) => {
      const cases = testCases.filter((t) => t.packageName === packageName);
      const cov = coverage.filter((c) => c.packageName === packageName);
      const sample = cases[0];
      return {
        packageName,
        application: sample?.application,
        platform: sample?.platform,
        totalTests: cases.length,
        passedTests: cases.filter((t) => t.status === "passed").length,
        failedTests: cases.filter((t) => t.status === "failed").length,
        skippedTests: cases.filter((t) => t.status === "skipped").length,
        statementCoverage: averageMetric(cov.map((c) => c.statementCoverage)),
        branchCoverage: averageMetric(cov.map((c) => c.branchCoverage)),
        functionCoverage: averageMetric(cov.map((c) => c.functionCoverage)),
        lineCoverage: averageMetric(cov.map((c) => c.lineCoverage)),
        thresholdStatus: "unavailable" as const,
        designSystemLevel: sample?.designSystemLevel,
        coverageMaturity: sample?.coverageMaturity,
      };
    });
}

export function applyMappings(
  testCases: readonly TestCaseRecord[],
  mappings: readonly TestMappingRecord[],
): TestCaseRecord[] {
  return testCases.map((test) => {
    const matched = mappings.filter((m) => m.tests.includes(test.testId));
    if (matched.length === 0) return test;
    const requirementIds = [
      ...new Set([
        ...test.requirementIds,
        ...matched.filter((m) => m.targetType === "requirement").map((m) => m.targetId),
      ]),
    ];
    const skillIds = [
      ...new Set([
        ...test.skillIds,
        ...matched.filter((m) => m.targetType === "skill").map((m) => m.targetId),
      ]),
    ];
    const agentIds = [
      ...new Set([
        ...test.agentIds,
        ...matched.filter((m) => m.targetType === "agent").map((m) => m.targetId),
      ]),
    ];
    const workflowIds = [
      ...new Set([
        ...test.workflowIds,
        ...matched.filter((m) => m.targetType === "workflow").map((m) => m.targetId),
      ]),
    ];
    const mcpToolIds = [
      ...new Set([
        ...test.mcpToolIds,
        ...matched.filter((m) => m.targetType === "mcpTool").map((m) => m.targetId),
      ]),
    ];
    const capabilityIds = [
      ...new Set([
        ...test.capabilityIds,
        ...matched
          .filter((m) => m.targetType === "capability" || m.targetType === "feature")
          .map((m) => m.targetId),
      ]),
    ];
    return {
      ...test,
      requirementIds,
      skillIds,
      agentIds,
      workflowIds,
      mcpToolIds,
      capabilityIds,
    };
  });
}

export function createQualityReport(input: {
  readonly repository: RepositoryIdentity;
  readonly testCases: readonly TestCaseRecord[];
  readonly coverage: readonly CoverageRecord[];
  readonly failures: readonly TestFailureRecord[];
  readonly mappings: readonly TestMappingRecord[];
  readonly requirements?: readonly RequirementRecord[];
  readonly generatedAt?: string;
  readonly packageReports?: readonly PackageQualityReport[];
}): QualityReport {
  const mappedCases = applyMappings(input.testCases, input.mappings);
  const packages = input.packageReports ?? buildPackageReports(mappedCases, input.coverage);
  const summary = buildSummary(mappedCases, input.coverage, packages);

  return {
    schemaVersion: SCHEMA,
    repository: input.repository,
    ...(input.generatedAt ? { generatedAt: input.generatedAt } : {}),
    summary,
    packages: sortById(packages, "packageName"),
    testCases: sortById(mappedCases, "testId"),
    coverage: sortById(input.coverage, "filePath"),
    requirements: sortById(input.requirements ?? [], "id"),
    mappings: sortById(input.mappings, "targetId"),
    failures: sortById(input.failures, "testId"),
    artifacts: [],
  };
}

export type { QUALITY_REPORT_SCHEMA_VERSION };
