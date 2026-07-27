import type { CoverageDelta, MetricValue, QualityReport } from "../schema/quality-report.js";
import { QUALITY_REPORT_SCHEMA_VERSION } from "../schema/quality-report.js";

function delta(current: MetricValue, baseline: MetricValue): MetricValue {
  if (typeof current !== "number" || typeof baseline !== "number") return "unavailable";
  return Number((current - baseline).toFixed(2));
}

function packageMetric(report: QualityReport, packageName: string): MetricValue {
  const pkg = report.packages.find((p) => p.packageName === packageName);
  return pkg?.lineCoverage ?? "unavailable";
}

export function compareCoverage(
  current: QualityReport,
  baseline: QualityReport,
): CoverageDelta {
  const currentFiles = new Set(current.coverage.map((c) => c.filePath));
  const baselineFiles = new Set(baseline.coverage.map((c) => c.filePath));

  const covered = (report: QualityReport, file: string): boolean => {
    const row = report.coverage.find((c) => c.filePath === file);
    return typeof row?.lineCoverage === "number" && row.lineCoverage > 0;
  };

  const newUncoveredFiles = [...currentFiles]
    .filter((file) => !covered(current, file) && covered(baseline, file))
    .sort();
  const newlyCoveredFiles = [...currentFiles]
    .filter((file) => covered(current, file) && !covered(baseline, file))
    .sort();

  const packageNames = new Set([
    ...current.packages.map((p) => p.packageName),
    ...baseline.packages.map((p) => p.packageName),
  ]);

  const packageRegressions: string[] = [];
  const packageImprovements: string[] = [];
  for (const name of [...packageNames].sort()) {
    const cur = packageMetric(current, name);
    const base = packageMetric(baseline, name);
    if (typeof cur === "number" && typeof base === "number") {
      if (cur < base) packageRegressions.push(name);
      if (cur > base) packageImprovements.push(name);
    }
  }

  return {
    schemaVersion: QUALITY_REPORT_SCHEMA_VERSION,
    statementDelta: delta(current.summary.statementCoverage, baseline.summary.statementCoverage),
    branchDelta: delta(current.summary.branchCoverage, baseline.summary.branchCoverage),
    functionDelta: delta(current.summary.functionCoverage, baseline.summary.functionCoverage),
    lineDelta: delta(current.summary.lineCoverage, baseline.summary.lineCoverage),
    newUncoveredFiles,
    newlyCoveredFiles,
    packageRegressions,
    packageImprovements,
  };
}
