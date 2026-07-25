#!/usr/bin/env node
/**
 * Lightweight path guardrail for Copilot agent tool use.
 * Denies edits to common secret/credential paths. No expensive commands.
 */
import fs from "node:fs";

const DENY_PATTERNS = [
  /(^|\/|\\)\.env($|\.)/i,
  /(^|\/|\\)credentials\.json$/i,
  /\.pem$/i,
  /\.jks$/i,
  /\.keystore$/i,
];

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function collectPaths(value, out = []) {
  if (!value || typeof value !== "object") {
    return out;
  }
  for (const [key, nested] of Object.entries(value)) {
    if (
      typeof nested === "string" &&
      /(path|file|uri|target)/i.test(key) &&
      nested.length < 512
    ) {
      out.push(nested);
    } else if (nested && typeof nested === "object") {
      collectPaths(nested, out);
    }
  }
  return out;
}

const raw = readStdin().trim();
let input = {};
if (raw) {
  try {
    input = JSON.parse(raw);
  } catch {
    input = {};
  }
}

const paths = collectPaths(input);
const blocked = paths.find((p) => DENY_PATTERNS.some((re) => re.test(p)));

if (blocked) {
  process.stdout.write(
    JSON.stringify({
      permissionDecision: "deny",
      permissionDecisionReason: `Blocked sensitive path: ${blocked}`,
    }),
  );
  process.exit(0);
}

process.stdout.write(JSON.stringify({ permissionDecision: "allow" }));
