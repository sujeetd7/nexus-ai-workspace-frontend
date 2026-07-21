#!/usr/bin/env node
import { Command } from "commander";

import { logger, runGenerator } from "./utils";

const program = new Command();

program
  .name("nexus-gen")
  .description("Nexus code generators")
  .showHelpAfterError();

function addCommonOptions(cmd: Command): Command {
  return cmd
    .argument("<name>", "Name of the artifact")
    .option("--path <path>", "Output directory", ".")
    .option("--force", "Overwrite existing files", false)
    .option("--dry-run", "Preview without writing files", false);
}

const commands = [
  "component",
  "hook",
  "slice",
  "api",
  "feature",
  "graphql",
  "saga",
  "screen",
] as const;

for (const kind of commands) {
  addCommonOptions(program.command(kind).description(`Generate a ${kind}`)).action(
    (
      name: string,
      opts: { path?: string; force?: boolean; dryRun?: boolean },
    ) => {
      try {
        runGenerator(kind, {
          name,
          path: opts.path,
          force: opts.force,
          dryRun: opts.dryRun,
        });
      } catch (error) {
        logger.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    },
  );
}

program.parseAsync(process.argv).catch((error: unknown) => {
  logger.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
