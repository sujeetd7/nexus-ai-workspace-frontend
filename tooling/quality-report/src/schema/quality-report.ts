/**
 * Normalized quality-report contract (schemaVersion 1.0.0).
 * Shared by frontend and engineering-platform tooling.
 * Agents must consume JSON — never terminal text or HTML.
 */

export const QUALITY_REPORT_SCHEMA_VERSION = "1.0.0" as const;

export type MetricValue = number | "unavailable";

export type TestType =
  | "unit"
  | "integration"
  | "component"
  | "accessibility"
  | "visual"
  | "contract"
  | "api"
  | "e2e"
  | "performance"
  | "security"
  | "architecture"
  | "evaluation"
  | "unknown";

export type TestStatus =
  | "passed"
  | "failed"
  | "skipped"
  | "todo"
  | "flaky"
  | "quarantined"
  | "unknown";

export type MappingTargetType =
  | "requirement"
  | "feature"
  | "source"
  | "component"
  | "package"
  | "skill"
  | "agent"
  | "workflow"
  | "mcpTool"
  | "capability"
  | "designLevel"
  | "platformSurface";

export type CoverageMaturity =
  | "none"
  | "descriptor-only"
  | "contract"
  | "runtime"
  | "integration"
  | "semantic"
  | "live-provider";

export type DesignSystemLevel =
  | "primitive"
  | "composite"
  | "pattern"
  | "screen"
  | "unknown";

export interface RepositoryIdentity {
  readonly id: string;
  readonly name: string;
  readonly kind: "frontend" | "engineering-platform" | "backend" | "other";
}

export interface QualitySummary {
  readonly totalTests: number;
  readonly passedTests: number;
  readonly failedTests: number;
  readonly skippedTests: number;
  readonly todoTests: number;
  readonly flakyTests: number;
  readonly quarantinedTests: number;
  readonly statementCoverage: MetricValue;
  readonly branchCoverage: MetricValue;
  readonly functionCoverage: MetricValue;
  readonly lineCoverage: MetricValue;
  readonly coveredFiles: number | "unavailable";
  readonly uncoveredFiles: number | "unavailable";
  readonly packagesPassingThreshold: number | "unavailable";
  readonly packagesFailingThreshold: number | "unavailable";
}

export interface TestCaseRecord {
  readonly testId: string;
  readonly testIdSource: "declared" | "generated";
  readonly title: string;
  readonly suite: string;
  readonly testType: TestType;
  readonly framework: "vitest" | "jest" | "playwright" | "storybook" | "unknown";
  readonly repository: string;
  readonly packageName: string;
  readonly application?: string;
  readonly platform?: string;
  readonly sourceFile?: string;
  readonly testFile: string;
  readonly status: TestStatus;
  readonly durationMs?: number;
  readonly retryCount?: number;
  readonly tags: readonly string[];
  readonly requirementIds: readonly string[];
  readonly capabilityIds: readonly string[];
  readonly agentIds: readonly string[];
  readonly skillIds: readonly string[];
  readonly workflowIds: readonly string[];
  readonly mcpToolIds: readonly string[];
  readonly owner?: string;
  readonly evidenceReferences: readonly string[];
  readonly designSystemLevel?: DesignSystemLevel;
  readonly coverageMaturity?: CoverageMaturity;
}

export interface CoverageRecord {
  readonly packageName: string;
  readonly filePath: string;
  readonly statementCoverage: MetricValue;
  readonly branchCoverage: MetricValue;
  readonly functionCoverage: MetricValue;
  readonly lineCoverage: MetricValue;
  readonly uncoveredLines: readonly number[];
  readonly critical: boolean;
}

export interface RequirementRecord {
  readonly id: string;
  readonly title?: string;
  readonly tags: readonly string[];
}

export interface TestMappingRecord {
  readonly targetType: MappingTargetType;
  readonly targetId: string;
  readonly tests: readonly string[];
  readonly maturity?: CoverageMaturity;
}

export interface TestFailureRecord {
  readonly testId: string;
  readonly title: string;
  readonly packageName: string;
  readonly testFile: string;
  readonly message?: string;
  readonly retryCount?: number;
  readonly artifactPaths: readonly string[];
}

export interface QualityArtifactReference {
  readonly kind: "html-coverage" | "lcov" | "json" | "trace" | "screenshot" | "video" | "other";
  readonly path: string;
  readonly packageName?: string;
}

export interface PackageQualityReport {
  readonly packageName: string;
  readonly application?: string;
  readonly platform?: string;
  readonly totalTests: number;
  readonly passedTests: number;
  readonly failedTests: number;
  readonly skippedTests: number;
  readonly statementCoverage: MetricValue;
  readonly branchCoverage: MetricValue;
  readonly functionCoverage: MetricValue;
  readonly lineCoverage: MetricValue;
  readonly thresholdStatus: "pass" | "fail" | "unavailable";
  readonly htmlReportPath?: string;
  readonly designSystemLevel?: DesignSystemLevel;
  readonly coverageMaturity?: CoverageMaturity;
}

export interface QualityReport {
  readonly schemaVersion: typeof QUALITY_REPORT_SCHEMA_VERSION;
  readonly repository: RepositoryIdentity;
  readonly generatedAt?: string;
  readonly summary: QualitySummary;
  readonly packages: readonly PackageQualityReport[];
  readonly testCases: readonly TestCaseRecord[];
  readonly coverage: readonly CoverageRecord[];
  readonly requirements: readonly RequirementRecord[];
  readonly mappings: readonly TestMappingRecord[];
  readonly failures: readonly TestFailureRecord[];
  readonly artifacts: readonly QualityArtifactReference[];
}

export interface CoverageDelta {
  readonly schemaVersion: typeof QUALITY_REPORT_SCHEMA_VERSION;
  readonly statementDelta: MetricValue;
  readonly branchDelta: MetricValue;
  readonly functionDelta: MetricValue;
  readonly lineDelta: MetricValue;
  readonly newUncoveredFiles: readonly string[];
  readonly newlyCoveredFiles: readonly string[];
  readonly packageRegressions: readonly string[];
  readonly packageImprovements: readonly string[];
}

export interface ThresholdConfig {
  readonly repository?: Partial<Record<"statement" | "branch" | "function" | "line", number>>;
  readonly packages?: Record<string, Partial<Record<"statement" | "branch" | "function" | "line", number>>>;
  readonly criticalFiles?: Record<string, Partial<Record<"statement" | "branch" | "function" | "line", number>>>;
  readonly noRegression?: boolean;
  readonly target?: Partial<Record<"statement" | "branch" | "function" | "line", number>>;
}

export interface QualityConfig {
  readonly repository: RepositoryIdentity;
  readonly port: number;
  readonly artifactRoot: string;
  readonly testMapPath: string;
  readonly thresholds: ThresholdConfig;
  readonly includeGeneratedAt: boolean;
}
