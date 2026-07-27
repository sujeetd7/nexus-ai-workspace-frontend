#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectAndGenerate } from "./collect/collect.js";
import { serveStaticDirectory } from "./serve/serve.js";
import type { QualityConfig } from "./schema/quality-report.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function findRepoRoot(start: string): string {
  let current = start;
  while (true) {
    if (fs.existsSync(path.join(current, "pnpm-workspace.yaml"))) return current;
    const parent = path.dirname(current);
    if (parent === current) return start;
    current = parent;
  }
}

function loadConfig(repoRoot: string): QualityConfig {
  const configPath = path.join(repoRoot, "quality", "quality.config.json");
  if (!fs.existsSync(configPath)) {
    throw new Error(`Missing quality config: ${configPath}`);
  }
  return JSON.parse(fs.readFileSync(configPath, "utf8")) as QualityConfig;
}

function loadPackageReports(repoRoot: string) {
  const manifestPath = path.join(repoRoot, "quality", "collect-manifest.json");
  if (!fs.existsSync(manifestPath)) return [];
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
    packages?: {
      packageName: string;
      framework: "vitest" | "jest" | "playwright" | "storybook";
      resultsPath?: string;
      coverageSummaryPath?: string;
      application?: string;
      platform?: string;
    }[];
  };
  return manifest.packages ?? [];
}

function usage(): void {
  console.log(`Usage:
  quality-report report [--baseline <path>]
  quality-report serve
  quality-report collect   (alias of report; expects raw artifacts already present)`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0] ?? "report";
  const repoRoot = findRepoRoot(path.resolve(__dirname, "../../.."));
  const config = loadConfig(repoRoot);

  if (command === "serve") {
    const dashboardRoot = path.join(repoRoot, config.artifactRoot, "dashboard");
    if (!fs.existsSync(path.join(dashboardRoot, "index.html"))) {
      throw new Error(`Dashboard not found at ${dashboardRoot}. Run quality:report first.`);
    }
    serveStaticDirectory({
      rootDir: dashboardRoot,
      host: "127.0.0.1",
      port: config.port,
    });
    console.log(`Quality dashboard:\nhttp://127.0.0.1:${config.port}`);
    return;
  }

  if (command === "report" || command === "collect") {
    const baselineIdx = args.indexOf("--baseline");
    const baselineReportPath =
      baselineIdx >= 0 ? args[baselineIdx + 1] : undefined;
    const report = collectAndGenerate({
      config,
      repoRoot,
      packageReports: loadPackageReports(repoRoot),
      baselineReportPath,
    });
    console.log(
      `Normalized quality report written for ${report.repository.name} (${report.summary.totalTests} tests).`,
    );
    console.log(`Dashboard: ${path.join(repoRoot, config.artifactRoot, "dashboard", "index.html")}`);
    return;
  }

  usage();
  process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
