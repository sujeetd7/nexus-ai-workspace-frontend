import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const source = process.env.GATEWAY_OPENAPI_URL ?? "http://localhost:3000/docs/json";
const output = resolve(
  process.cwd(),
  "quality/contracts/gateway-openapi.snapshot.json",
);

async function main(): Promise<void> {
  let operationCount = 0;

  try {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Gateway OpenAPI fetch failed: ${response.status}`);
    }

    const document = (await response.json()) as { paths?: Record<string, unknown> };
    operationCount = Object.keys(document.paths ?? {}).length;
  } catch (error) {
    console.warn(
      `[contract:sync] Gateway unavailable; updating metadata only.`,
      error instanceof Error ? error.message : error,
    );
  }

  const snapshot = {
    source,
    owner: "frontend-platform",
    syncedAt: new Date().toISOString(),
    operationCount,
    excludedServices: ["admin", "analytics", "notification"],
    notes:
      "Curated Auth types live in packages/shared-types/src/auth. Snapshot metadata only.",
  };

  writeFileSync(output, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  console.log(`[contract:sync] Wrote ${output}`);
}

void main();
