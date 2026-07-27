import type { CoverageDelta, QualityReport } from "../schema/quality-report.js";

function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function metric(value: unknown): string {
  return value === "unavailable" || value === undefined || value === null
    ? "unavailable"
    : `${value}%`;
}

export function generateDashboardHtml(
  report: QualityReport,
  options?: { readonly delta?: CoverageDelta },
): string {
  const unmapped = report.testCases.filter(
    (t) =>
      t.requirementIds.length === 0 &&
      t.skillIds.length === 0 &&
      t.agentIds.length === 0 &&
      t.capabilityIds.length === 0,
  );
  const targetsWithoutTests = report.mappings.filter((m) => m.tests.length === 0);
  const uncovered = report.coverage.filter(
    (c) => c.lineCoverage === 0 || c.lineCoverage === "unavailable",
  );

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Quality Dashboard — ${esc(report.repository.name)}</title>
  <style>
    :root { --bg:#0f1419; --panel:#1a222c; --text:#e7eef7; --muted:#9aa7b5; --ok:#3dd68c; --bad:#ff6b6b; --line:#2a3542; }
    body { margin:0; font-family: ui-sans-serif, system-ui, sans-serif; background:var(--bg); color:var(--text); }
    header { padding:24px 32px; border-bottom:1px solid var(--line); }
    h1 { margin:0 0 8px; font-size:24px; }
    .muted { color:var(--muted); }
    main { padding:24px 32px; display:grid; gap:20px; }
    section { background:var(--panel); border:1px solid var(--line); border-radius:12px; padding:16px 18px; }
    h2 { margin:0 0 12px; font-size:16px; }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px; }
    .stat { background:#121820; border-radius:8px; padding:12px; }
    .stat strong { display:block; font-size:20px; margin-top:4px; }
    table { width:100%; border-collapse:collapse; font-size:13px; }
    th, td { text-align:left; padding:8px 6px; border-bottom:1px solid var(--line); vertical-align:top; }
    .ok { color:var(--ok); } .bad { color:var(--bad); }
    input[type=search] { width:min(420px,100%); padding:8px 10px; border-radius:8px; border:1px solid var(--line); background:#121820; color:var(--text); margin-bottom:10px; }
    a { color:#8ec7ff; }
  </style>
</head>
<body>
  <header>
    <h1>Quality Dashboard</h1>
    <div class="muted">${esc(report.repository.name)} · ${esc(report.repository.kind)} · schema ${esc(report.schemaVersion)}${report.generatedAt ? ` · ${esc(report.generatedAt)}` : ""}</div>
  </header>
  <main>
    <section>
      <h2>Overview</h2>
      <div class="grid">
        <div class="stat">Tests<strong>${esc(report.summary.totalTests)}</strong></div>
        <div class="stat">Passed<strong class="ok">${esc(report.summary.passedTests)}</strong></div>
        <div class="stat">Failed<strong class="${report.summary.failedTests ? "bad" : ""}">${esc(report.summary.failedTests)}</strong></div>
        <div class="stat">Skipped<strong>${esc(report.summary.skippedTests)}</strong></div>
        <div class="stat">Flaky<strong>${esc(report.summary.flakyTests)}</strong></div>
        <div class="stat">Lines<strong>${esc(metric(report.summary.lineCoverage))}</strong></div>
        <div class="stat">Branches<strong>${esc(metric(report.summary.branchCoverage))}</strong></div>
        <div class="stat">Threshold pass<strong>${esc(report.summary.packagesPassingThreshold)}</strong></div>
        <div class="stat">Threshold fail<strong>${esc(report.summary.packagesFailingThreshold)}</strong></div>
      </div>
    </section>

    <section>
      <h2>Packages</h2>
      <table>
        <thead><tr><th>Package</th><th>Tests</th><th>Failed</th><th>Line</th><th>Branch</th><th>Threshold</th><th>Report</th></tr></thead>
        <tbody>
          ${report.packages
            .map(
              (p) => `<tr>
              <td>${esc(p.packageName)}</td>
              <td>${esc(p.totalTests)}</td>
              <td class="${p.failedTests ? "bad" : ""}">${esc(p.failedTests)}</td>
              <td>${esc(metric(p.lineCoverage))}</td>
              <td>${esc(metric(p.branchCoverage))}</td>
              <td class="${p.thresholdStatus === "fail" ? "bad" : p.thresholdStatus === "pass" ? "ok" : ""}">${esc(p.thresholdStatus)}</td>
              <td>${p.htmlReportPath ? `<a href="${esc(p.htmlReportPath)}">html</a>` : "—"}</td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </section>

    <section>
      <h2>Test Map</h2>
      <input id="mapFilter" type="search" placeholder="Filter mappings / tests" />
      <table id="mapTable">
        <thead><tr><th>Target</th><th>Type</th><th>Tests</th><th>Maturity</th></tr></thead>
        <tbody>
          ${report.mappings
            .map(
              (m) => `<tr data-q="${esc(`${m.targetType} ${m.targetId} ${m.tests.join(" ")}`).toLowerCase()}">
              <td>${esc(m.targetId)}</td><td>${esc(m.targetType)}</td><td>${esc(m.tests.join(", ") || "(none)")}</td><td>${esc(m.maturity ?? "—")}</td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>
      <p class="muted">Unmapped tests: ${esc(unmapped.length)} · Targets with no tests: ${esc(targetsWithoutTests.length)}</p>
    </section>

    <section>
      <h2>Coverage Gaps</h2>
      <table>
        <thead><tr><th>File</th><th>Package</th><th>Line</th><th>Branch</th></tr></thead>
        <tbody>
          ${uncovered
            .slice(0, 200)
            .map(
              (c) => `<tr><td>${esc(c.filePath)}</td><td>${esc(c.packageName)}</td><td>${esc(metric(c.lineCoverage))}</td><td>${esc(metric(c.branchCoverage))}</td></tr>`,
            )
            .join("") || `<tr><td colspan="4" class="muted">No uncovered files in report (or coverage unavailable).</td></tr>`}
        </tbody>
      </table>
    </section>

    <section>
      <h2>Failures</h2>
      <table>
        <thead><tr><th>Test</th><th>Package</th><th>Retries</th><th>Message</th><th>Artifacts</th></tr></thead>
        <tbody>
          ${report.failures
            .map(
              (f) => `<tr>
              <td>${esc(f.title)}</td><td>${esc(f.packageName)}</td><td>${esc(f.retryCount ?? 0)}</td>
              <td>${esc(f.message ?? "")}</td><td>${esc(f.artifactPaths.join(", ") || "—")}</td>
            </tr>`,
            )
            .join("") || `<tr><td colspan="5" class="muted">No failures.</td></tr>`}
        </tbody>
      </table>
    </section>

    ${
      options?.delta
        ? `<section>
      <h2>Coverage Delta</h2>
      <div class="grid">
        <div class="stat">Statement Δ<strong>${esc(options.delta.statementDelta)}</strong></div>
        <div class="stat">Branch Δ<strong>${esc(options.delta.branchDelta)}</strong></div>
        <div class="stat">Function Δ<strong>${esc(options.delta.functionDelta)}</strong></div>
        <div class="stat">Line Δ<strong>${esc(options.delta.lineDelta)}</strong></div>
      </div>
      <p class="muted">Regressions: ${esc(options.delta.packageRegressions.join(", ") || "none")} · Improvements: ${esc(options.delta.packageImprovements.join(", ") || "none")}</p>
    </section>`
        : ""
    }

    <section>
      <h2>Machine-readable artifacts</h2>
      <ul>
        <li><a href="./data/quality-report.json">quality-report.json</a></li>
        <li><a href="./data/test-map.json">test-map.json</a></li>
        <li><a href="./data/coverage-summary.json">coverage-summary.json</a></li>
        <li><a href="./data/coverage-delta.json">coverage-delta.json</a> (when baseline provided)</li>
      </ul>
      <p class="muted">Agents must consume JSON only. HTML is for humans.</p>
    </section>
  </main>
  <script>
    const input = document.getElementById('mapFilter');
    const rows = [...document.querySelectorAll('#mapTable tbody tr')];
    input?.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      rows.forEach((row) => {
        row.style.display = !q || row.dataset.q.includes(q) ? '' : 'none';
      });
    });
  </script>
</body>
</html>`;
}
