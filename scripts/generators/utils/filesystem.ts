import fs from "node:fs";
import path from "node:path";

import { logger } from "./logger";

export interface WriteOptions {
  force?: boolean;
  dryRun?: boolean;
  /** Tracks files created during this generation for rollback. */
  createdFiles?: string[];
}

export function ensureDir(dirPath: string, options: WriteOptions): void {
  if (options.dryRun) {
    logger.info(`[dry-run] mkdir ${dirPath}`);
    return;
  }

  fs.mkdirSync(dirPath, { recursive: true });
}

function toPosixNewlines(content: string): string {
  return content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function writeAtomically(filePath: string, content: string): void {
  const directory = path.dirname(filePath);
  fs.mkdirSync(directory, { recursive: true });

  const tempPath = path.join(
    directory,
    `.${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`,
  );

  try {
    fs.writeFileSync(tempPath, content, "utf8");

    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath, { force: true });
    }

    fs.renameSync(tempPath, filePath);
  } catch (error) {
    if (fs.existsSync(tempPath)) {
      fs.rmSync(tempPath, { force: true });
    }

    throw error;
  }
}

export function writeFile(
  filePath: string,
  content: string,
  options: WriteOptions,
): "created" | "overwritten" {
  const exists = fs.existsSync(filePath);

  if (exists && !options.force) {
    throw new Error(
      `File already exists: ${filePath}. Use --force to overwrite.`,
    );
  }

  const payload = toPosixNewlines(content);

  if (options.dryRun) {
    logger.info(`[dry-run] ${exists ? "overwrite" : "create"} ${filePath}`);
    return exists ? "overwritten" : "created";
  }

  writeAtomically(filePath, payload);

  if (!exists) {
    options.createdFiles?.push(filePath);
  }

  return exists ? "overwritten" : "created";
}

export function rollbackCreatedFiles(filePaths: readonly string[]): void {
  for (const filePath of [...filePaths].reverse()) {
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath, { force: true });
    }
  }
}

function isExportLine(line: string): boolean {
  return /^\s*export\s/.test(line);
}

export function upsertIndexExport(
  indexPath: string,
  exportPath: string,
  options: WriteOptions,
): void {
  const line = `export * from "${exportPath}";`;
  const exists = fs.existsSync(indexPath);

  if (!exists) {
    writeFile(indexPath, `${line}\n`, options);
    return;
  }

  const current = toPosixNewlines(fs.readFileSync(indexPath, "utf8"));
  const lines = current.split("\n");

  const alreadyPresent = lines.some((entry) => {
    const trimmed = entry.trim();
    return (
      trimmed === line ||
      trimmed === `export * from '${exportPath}';` ||
      trimmed.includes(`from "${exportPath}"`) ||
      trimmed.includes(`from '${exportPath}'`)
    );
  });

  if (alreadyPresent) {
    logger.info(`Export already present in ${indexPath}`);
    return;
  }

  const nonEmpty = lines.filter((entry, index) => {
    if (entry.trim() !== "") {
      return true;
    }

    // Keep blank lines that are not trailing.
    return index < lines.length - 1 && lines.slice(index + 1).some((l) => l.trim());
  });

  const otherLines = nonEmpty.filter((entry) => !isExportLine(entry));
  const exportLines = [
    ...nonEmpty.filter((entry) => isExportLine(entry)),
    line,
  ].sort((left, right) => left.trim().localeCompare(right.trim(), "en"));

  const next = `${[...otherLines, ...exportLines].join("\n")}\n`;

  // Barrel updates are generator-owned metadata; allow write even when the
  // caller did not pass --force. Never rewrite unrelated non-index files.
  writeFile(indexPath, next, { ...options, force: true });
}
