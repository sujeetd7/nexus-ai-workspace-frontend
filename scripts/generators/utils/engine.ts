import path from "node:path";

import {
  ensureDir,
  rollbackCreatedFiles,
  upsertIndexExport,
  writeFile,
} from "./filesystem";
import { logger } from "./logger";
import {
  assertIdentifier,
  ensureHookName,
  toCamelCase,
  toPascalCase,
} from "./naming";
import { resolveOutputPath, validateName } from "./paths";
import { loadTemplate, renderTemplate } from "./template";

export type GeneratorKind = "component" | "hook" | "slice";

export interface GeneratorOptions {
  name: string;
  path?: string;
  force?: boolean;
  dryRun?: boolean;
}

export interface GeneratorResult {
  kind: GeneratorKind;
  files: string[];
}

const IMPLEMENTED: readonly GeneratorKind[] = ["component", "hook", "slice"];

type WriteOpts = {
  force: boolean;
  dryRun: boolean;
  createdFiles: string[];
};

export function runGenerator(
  kind: string,
  options: GeneratorOptions,
): GeneratorResult {
  if (!IMPLEMENTED.includes(kind as GeneratorKind)) {
    throw new Error(
      `Generator "${kind}" is not implemented yet. Available: ${IMPLEMENTED.join(", ")}`,
    );
  }

  const rawName = validateName(options.name);
  const outRoot = resolveOutputPath(options.path ?? ".");
  const createdFiles: string[] = [];
  const writeOpts: WriteOpts = {
    force: Boolean(options.force),
    dryRun: Boolean(options.dryRun),
    createdFiles,
  };

  try {
    let result: GeneratorResult;

    switch (kind as GeneratorKind) {
      case "component":
        result = generateComponent(rawName, outRoot, writeOpts);
        break;
      case "hook":
        result = generateHook(rawName, outRoot, writeOpts);
        break;
      case "slice":
        result = generateSlice(rawName, outRoot, writeOpts);
        break;
      default:
        throw new Error(`Unsupported generator: ${kind}`);
    }

    result.files = [...result.files].sort((left, right) =>
      left.localeCompare(right, "en"),
    );

    return result;
  } catch (error) {
    if (!writeOpts.dryRun) {
      rollbackCreatedFiles(createdFiles);
    }

    throw error;
  }
}

function generateComponent(
  rawName: string,
  outRoot: string,
  writeOpts: WriteOpts,
): GeneratorResult {
  const name = toPascalCase(rawName);
  assertIdentifier(name, "Component name");

  const dir = path.join(outRoot, name);
  const componentFile = path.join(dir, `${name}.tsx`);
  const indexFile = path.join(dir, "index.ts");
  const parentIndex = path.join(outRoot, "index.ts");
  const vars = { name };

  ensureDir(dir, writeOpts);
  writeFile(
    componentFile,
    renderTemplate(loadTemplate("component", "Component.tsx.hbs"), vars),
    writeOpts,
  );
  writeFile(
    indexFile,
    renderTemplate(loadTemplate("component", "index.ts.hbs"), vars),
    writeOpts,
  );
  upsertIndexExport(parentIndex, `./${name}`, writeOpts);

  logger.success(`Generated component ${name}`);
  logger.info(`  ${componentFile}`);
  logger.info(`  ${indexFile}`);

  return { kind: "component", files: [componentFile, indexFile] };
}

function generateHook(
  rawName: string,
  outRoot: string,
  writeOpts: WriteOpts,
): GeneratorResult {
  const name = ensureHookName(rawName);
  const dir = path.join(outRoot, name);
  const hookFile = path.join(dir, `${name}.ts`);
  const indexFile = path.join(dir, "index.ts");
  const parentIndex = path.join(outRoot, "index.ts");
  const vars = { name };

  ensureDir(dir, writeOpts);
  writeFile(
    hookFile,
    renderTemplate(loadTemplate("hook", "hook.ts.hbs"), vars),
    writeOpts,
  );
  writeFile(
    indexFile,
    renderTemplate(loadTemplate("hook", "index.ts.hbs"), vars),
    writeOpts,
  );
  upsertIndexExport(parentIndex, `./${name}`, writeOpts);

  logger.success(`Generated hook ${name}`);
  logger.info(`  ${hookFile}`);
  logger.info(`  ${indexFile}`);

  return { kind: "hook", files: [hookFile, indexFile] };
}

function generateSlice(
  rawName: string,
  outRoot: string,
  writeOpts: WriteOpts,
): GeneratorResult {
  const camelName = toCamelCase(rawName);
  assertIdentifier(camelName, "Slice name");
  const pascalName = toPascalCase(rawName);

  const dir = path.join(outRoot, camelName);
  const sliceFile = path.join(dir, `${camelName}Slice.ts`);
  const indexFile = path.join(dir, "index.ts");
  const parentIndex = path.join(outRoot, "index.ts");
  const vars = { name: camelName, pascalName };

  ensureDir(dir, writeOpts);
  writeFile(
    sliceFile,
    renderTemplate(loadTemplate("slice", "slice.ts.hbs"), vars),
    writeOpts,
  );
  writeFile(
    indexFile,
    renderTemplate(loadTemplate("slice", "index.ts.hbs"), vars),
    writeOpts,
  );
  upsertIndexExport(parentIndex, `./${camelName}`, writeOpts);

  logger.success(`Generated slice ${camelName}`);
  logger.info(`  ${sliceFile}`);
  logger.info(`  ${indexFile}`);

  return { kind: "slice", files: [sliceFile, indexFile] };
}
