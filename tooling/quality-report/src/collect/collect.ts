import fs from "node:fs";
import path from "node:path";
import { adaptJest, adaptPlaywright, adaptStorybook, adaptVitest } from "../adapters/index.js";
import { createQualityReport } from "../normalize/report.js";
import { applyThresholds } from "../thresholds/evaluate.js";
import { compareCoverage } from "../delta/compare.js";
import { generateDashboardHtml } from "../dashboard/generate.js";
import type {
  QualityConfig,
  QualityReport,
  TestMappingRecord,
} from "../schema/quality-report.js";

function readJson(filePath: string): unknown | undefined {
  if (!fs.existsSync(filePath)) return undefined;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return undefined;
  }
}

function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath: string, value: unknown): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export interface CollectInput {
  readonly config: QualityConfig;
  readonly repoRoot: string;
  readonly packageReports?: readonly {
    readonly packageName: string;
    readonly framework: "vitest" | "jest" | "playwright" | "storybook";
    readonly resultsPath?: string;
    readonly coverageSummaryPath?: string;
    readonly application?: string;
    readonly platform?: string;
  }[];
  readonly baselineReportPath?: string;
}

export function collectAndGenerate(input: CollectInput): QualityReport {
  const rawRoot = path.join(input.repoRoot, input.config.artifactRoot, input.config.repository.kind === "frontend" ? "frontend" : "engineering-platform", "raw");
  const normalizedRoot = path.join(input.repoRoot, input.config.artifactRoot, input.config.repository.kind === "frontend" ? "frontend" : "engineering-platform", "normalized");
  const dashboardRoot = path.join(input.repoRoot, input.config.artifactRoot, "dashboard");
  const dataRoot = path.join(dashboardRoot, "data");

  ensureDir(rawRoot);
  ensureDir(normalizedRoot);
  ensureDir(dataRoot);

  const mapJson = readJson(path.join(input.repoRoot, input.config.testMapPath)) as
    | { mappings?: TestMappingRecord[]; requirements?: { id: string; title?: string; tags?: string[] }[] }
    | undefined;
  const mappings = mapJson?.mappings ?? [];
  const requirements = (mapJson?.requirements ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    tags: r.tags ?? [],
  }));

  const testCases = [];
  const coverage = [];
  const failures = [];

  for (const pkg of input.packageReports ?? []) {
    const resultsJson = pkg.resultsPath ? readJson(path.join(input.repoRoot, pkg.resultsPath)) : undefined;
    const coverageSummary = pkg.coverageSummaryPath
      ? readJson(path.join(input.repoRoot, pkg.coverageSummaryPath))
      : undefined;

    const adapted =
      pkg.framework === "jest"
        ? adaptJest({
            repository: input.config.repository.id,
            packageName: pkg.packageName,
            resultsJson,
            coverageSummary,
            application: pkg.application,
            platform: pkg.platform,
          })
        : pkg.framework === "playwright"
          ? adaptPlaywright({
              repository: input.config.repository.id,
              packageName: pkg.packageName,
              resultsJson,
            })
          : pkg.framework === "storybook"
            ? adaptStorybook({
                repository: input.config.repository.id,
                packageName: pkg.packageName,
                resultsJson,
              })
            : adaptVitest({
                repository: input.config.repository.id,
                packageName: pkg.packageName,
                resultsJson,
                coverageSummary,
                application: pkg.application,
                platform: pkg.platform,
              });

    testCases.push(...adapted.testCases);
    coverage.push(...adapted.coverage);
    failures.push(...adapted.failures);
  }

  let report = createQualityReport({
    repository: input.config.repository,
    testCases,
    coverage,
    failures,
    mappings,
    requirements,
    generatedAt: input.config.includeGeneratedAt ? new Date().toISOString() : undefined,
  });
  report = applyThresholds(report, input.config.thresholds);

  writeJson(path.join(normalizedRoot, "quality-report.json"), report);
  writeJson(path.join(dataRoot, "quality-report.json"), report);
  writeJson(path.join(dataRoot, "test-map.json"), { mappings, requirements });
  writeJson(path.join(dataRoot, "coverage-summary.json"), {
    statementCoverage: report.summary.statementCoverage,
    branchCoverage: report.summary.branchCoverage,
    functionCoverage: report.summary.functionCoverage,
    lineCoverage: report.summary.lineCoverage,
    coveredFiles: report.summary.coveredFiles,
    uncoveredFiles: report.summary.uncoveredFiles,
  });

  let delta;
  if (input.baselineReportPath) {
    const baseline = readJson(path.join(input.repoRoot, input.baselineReportPath)) as QualityReport | undefined;
    if (baseline) {
      delta = compareCoverage(report, baseline);
      writeJson(path.join(dataRoot, "coverage-delta.json"), delta);
    }
  }
  if (!delta) {
    writeJson(path.join(dataRoot, "coverage-delta.json"), {
      schemaVersion: report.schemaVersion,
      statementDelta: "unavailable",
      branchDelta: "unavailable",
      functionDelta: "unavailable",
      lineDelta: "unavailable",
      newUncoveredFiles: [],
      newlyCoveredFiles: [],
      packageRegressions: [],
      packageImprovements: [],
    });
  }

  const html = generateDashboardHtml(report, { delta });
  fs.writeFileSync(path.join(dashboardRoot, "index.html"), html, "utf8");

  return report;
}
