import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { adaptJest, adaptPlaywright, adaptVitest } from "../adapters/index.js";
import { compareCoverage } from "../delta/compare.js";
import { generateDashboardHtml } from "../dashboard/generate.js";
import { applyMappings, createQualityReport } from "../normalize/report.js";
import { applyThresholds } from "../thresholds/evaluate.js";
import type { QualityReport } from "../schema/quality-report.js";

const root = dirname(fileURLToPath(import.meta.url));
const fixtures = join(root, "../../fixtures");

function load(name: string): unknown {
  return JSON.parse(readFileSync(join(fixtures, name), "utf8"));
}

describe("quality-report adapters", () => {
  it("normalizes vitest results and coverage", () => {
    const adapted = adaptVitest({
      repository: "engineering-platform",
      packageName: "@ai-engineering/example",
      resultsJson: load("vitest-results.json"),
      coverageSummary: load("coverage-summary.json"),
    });
    expect(adapted.testCases).toHaveLength(2);
    expect(adapted.failures).toHaveLength(1);
    expect(adapted.coverage.some((c) => c.filePath === "src/uncovered.ts")).toBe(true);
    expect(adapted.testCases[0]?.testIdSource).toBe("generated");
  });

  it("normalizes jest via shared adapter path", () => {
    const adapted = adaptJest({
      repository: "frontend",
      packageName: "mobile",
      resultsJson: load("vitest-results.json"),
    });
    expect(adapted.testCases[0]?.framework).toBe("jest");
  });

  it("preserves playwright retry metadata as flaky when final pass", () => {
    const adapted = adaptPlaywright({
      repository: "frontend",
      packageName: "web-e2e",
      resultsJson: load("playwright-results.json"),
    });
    expect(adapted.testCases[0]?.status).toBe("flaky");
    expect(adapted.testCases[0]?.retryCount).toBe(1);
  });

  it("handles missing reports without fabricating metrics", () => {
    const adapted = adaptVitest({
      repository: "engineering-platform",
      packageName: "@ai-engineering/example",
    });
    expect(adapted.testCases).toEqual([]);
    expect(adapted.coverage).toEqual([]);
  });

  it("handles malformed coverage entries as unavailable metrics only for invalid numbers", () => {
    const adapted = adaptVitest({
      repository: "engineering-platform",
      packageName: "@ai-engineering/example",
      coverageSummary: {
        "src/bad.ts": { statements: { pct: "nope" }, lines: {} },
      },
    });
    expect(adapted.coverage[0]?.statementCoverage).toBe("unavailable");
    expect(adapted.coverage[0]?.lineCoverage).toBe("unavailable");
  });
});

describe("quality-report normalize + thresholds + delta", () => {
  const repository = {
    id: "engineering-platform",
    name: "nexus-ai-engineering-platform",
    kind: "engineering-platform" as const,
  };

  it("creates deterministic ordered reports without generatedAt by default", () => {
    const adapted = adaptVitest({
      repository: repository.id,
      packageName: "@ai-engineering/example",
      resultsJson: load("vitest-results.json"),
      coverageSummary: load("coverage-summary.json"),
    });
    const report = createQualityReport({
      repository,
      testCases: adapted.testCases,
      coverage: adapted.coverage,
      failures: adapted.failures,
      mappings: [],
    });
    expect(report.generatedAt).toBeUndefined();
    expect(report.summary.failedTests).toBe(1);
    expect(report.testCases.map((t) => t.testId)).toEqual(
      [...report.testCases.map((t) => t.testId)].sort((a, b) => a.localeCompare(b)),
    );
  });

  it("applies mappings without mutating input arrays", () => {
    const adapted = adaptVitest({
      repository: repository.id,
      packageName: "@ai-engineering/example",
      resultsJson: load("vitest-results.json"),
    });
    const original = adapted.testCases;
    const testId = original[0]!.testId;
    const mappings = [
      {
        targetType: "skill" as const,
        targetId: "coverage-gap-analysis",
        tests: [testId],
        maturity: "contract" as const,
      },
    ];
    const mapped = applyMappings(original, mappings);
    expect(original[0]?.skillIds).toEqual([]);
    expect(mapped[0]?.skillIds).toEqual(["coverage-gap-analysis"]);
  });

  it("evaluates thresholds and computes coverage delta", () => {
    const adapted = adaptVitest({
      repository: repository.id,
      packageName: "@ai-engineering/example",
      resultsJson: load("vitest-results.json"),
      coverageSummary: load("coverage-summary.json"),
    });
    const current = applyThresholds(
      createQualityReport({
        repository,
        testCases: adapted.testCases,
        coverage: adapted.coverage,
        failures: adapted.failures,
        mappings: [],
      }),
      { packages: { "@ai-engineering/example": { line: 90 } } },
    );
    expect(current.packages[0]?.thresholdStatus).toBe("fail");

    const baseline: QualityReport = {
      ...current,
      summary: { ...current.summary, lineCoverage: 90 },
      packages: current.packages.map((p) => ({ ...p, lineCoverage: 90 })),
    };
    const delta = compareCoverage(current, baseline);
    expect(delta.lineDelta).not.toBe("unavailable");
    expect(delta.packageRegressions).toContain("@ai-engineering/example");
  });

  it("generates html with relative artifact links and no secrets", () => {
    const adapted = adaptVitest({
      repository: repository.id,
      packageName: "@ai-engineering/example",
      resultsJson: load("vitest-results.json"),
      coverageSummary: load("coverage-summary.json"),
    });
    const report = createQualityReport({
      repository,
      testCases: adapted.testCases,
      coverage: adapted.coverage,
      failures: adapted.failures,
      mappings: [],
    });
    const html = generateDashboardHtml(report);
    expect(html).toContain("./data/quality-report.json");
    expect(html).not.toContain("password");
    expect(html).not.toContain("SECRET");
    expect(html).toContain("Quality Dashboard");
  });

  it("marks unknown test types only when framework mapping cannot classify better", () => {
    const adapted = adaptVitest({
      repository: repository.id,
      packageName: "@ai-engineering/example",
      resultsJson: {
        testResults: [
          {
            name: "x.test.ts",
            assertionResults: [{ title: "t", status: "weird", ancestorTitles: [] }],
          },
        ],
      },
    });
    expect(adapted.testCases[0]?.status).toBe("unknown");
    expect(adapted.testCases[0]?.testType).toBe("unit");
  });
});
