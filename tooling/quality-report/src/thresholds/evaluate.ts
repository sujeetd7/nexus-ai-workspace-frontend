import type {
  MetricValue,
  PackageQualityReport,
  QualityReport,
  ThresholdConfig,
} from "../schema/quality-report.js";

function meets(
  actual: MetricValue,
  required: number | undefined,
): "pass" | "fail" | "unavailable" {
  if (required === undefined) return "unavailable";
  if (typeof actual !== "number") return "unavailable";
  return actual >= required ? "pass" : "fail";
}

export function applyThresholds(
  report: QualityReport,
  thresholds: ThresholdConfig,
): QualityReport {
  const packages: PackageQualityReport[] = report.packages.map((pkg) => {
    const packageThresholds = {
      ...thresholds.repository,
      ...thresholds.packages?.[pkg.packageName],
    };
    const checks = [
      meets(pkg.statementCoverage, packageThresholds.statement),
      meets(pkg.branchCoverage, packageThresholds.branch),
      meets(pkg.functionCoverage, packageThresholds.function),
      meets(pkg.lineCoverage, packageThresholds.line),
    ].filter((c) => c !== "unavailable");

    let thresholdStatus: PackageQualityReport["thresholdStatus"] = "unavailable";
    if (checks.length > 0) {
      thresholdStatus = checks.every((c) => c === "pass") ? "pass" : "fail";
    }

    return { ...pkg, thresholdStatus };
  });

  const evaluated = packages.filter((p) => p.thresholdStatus !== "unavailable");
  return {
    ...report,
    packages,
    summary: {
      ...report.summary,
      packagesPassingThreshold:
        evaluated.length === 0
          ? "unavailable"
          : evaluated.filter((p) => p.thresholdStatus === "pass").length,
      packagesFailingThreshold:
        evaluated.length === 0
          ? "unavailable"
          : evaluated.filter((p) => p.thresholdStatus === "fail").length,
    },
  };
}

export function evaluateCriticalFiles(
  report: QualityReport,
  thresholds: ThresholdConfig,
): readonly { filePath: string; status: "pass" | "fail" | "unavailable" }[] {
  const critical = thresholds.criticalFiles ?? {};
  return Object.entries(critical)
    .map(([filePath, req]) => {
      const row = report.coverage.find((c) => c.filePath === filePath);
      if (!row) return { filePath, status: "unavailable" as const };
      const checks = [
        meets(row.statementCoverage, req.statement),
        meets(row.branchCoverage, req.branch),
        meets(row.lineCoverage, req.line),
      ].filter((c) => c !== "unavailable");
      if (checks.length === 0) return { filePath, status: "unavailable" as const };
      return {
        filePath,
        status: (checks.every((c) => c === "pass") ? "pass" : "fail") as "pass" | "fail",
      };
    })
    .sort((a, b) => a.filePath.localeCompare(b.filePath));
}
