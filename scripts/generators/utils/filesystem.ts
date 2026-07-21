import fs from "node:fs";
import path from "node:path";

import { logger } from "./logger";

export interface WriteOptions {
  force?: boolean;
  dryRun?: boolean;
}

export function ensureDir(dirPath: string, options: WriteOptions): void {
  if (options.dryRun) {
    logger.info(`[dry-run] mkdir ${dirPath}`);
    return;
  }

  fs.mkdirSync(dirPath, { recursive: true });
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

  if (options.dryRun) {
    logger.info(`[dry-run] ${exists ? "overwrite" : "create"} ${filePath}`);
    return exists ? "overwritten" : "created";
  }

  ensureDir(path.dirname(filePath), options);
  fs.writeFileSync(filePath, content, "utf8");

  return exists ? "overwritten" : "created";
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

  const current = fs.readFileSync(indexPath, "utf8");

  if (
    current.includes(line) ||
    current.includes(`from "${exportPath}"`) ||
    current.includes(`from '${exportPath}'`)
  ) {
    logger.info(`Export already present in ${indexPath}`);
    return;
  }

  const next = `${current.trimEnd()}\n${line}\n`;
  writeFile(indexPath, next, { ...options, force: true });
}
