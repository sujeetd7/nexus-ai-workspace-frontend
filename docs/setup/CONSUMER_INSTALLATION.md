# Consumer Installation — AI Engineering Platform Wave 1

Audience: **Nexus AI Workspace Frontend** — first external consumer of the AI Engineering Platform.

## Status

| Item                     | Value                                          |
| ------------------------ | ---------------------------------------------- |
| Consumer                 | `nexus-ai-workspace-frontend`                  |
| Registry                 | GitHub Packages (`https://npm.pkg.github.com`) |
| Scope                    | `@sujeetd7`                                    |
| Supported version        | **`0.1.1` only**                               |
| Integration location     | `tooling/engineering-platform/` (tooling-only) |
| Figma MCP / Code Connect | **Deferred**                                   |

## Prerequisites

1. GitHub credential with `read:packages` for owner **`sujeetd7`**
2. Non-secret registry mapping in repository `.npmrc` (already committed)
3. Auth via environment — **never commit tokens**

## Local authentication

```powershell
$env:NODE_AUTH_TOKEN = "<github-pat-with-read:packages>"
pnpm install
```

Optional user-level `~/.npmrc` (outside git):

```ini
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

## Installed packages (root devDependencies)

Exact pins at **`0.1.1`**:

- `@sujeetd7/ai-engineering-contracts`
- `@sujeetd7/ai-engineering-project-adapter-contracts`
- `@sujeetd7/ai-engineering-runtime`
- `@sujeetd7/ai-engineering-registry-runtime`
- `@sujeetd7/ai-engineering-project-adapter-registry`

Do **not** use `workspace:`, `file:`, `link:`, local tarballs, or `@0.1.0`.

## Tooling integration

Engineering Platform code lives under `tooling/engineering-platform/`:

- Project descriptor (`createFrontendProjectDescriptor`)
- Adapter factory (`createFrontendProjectAdapter`)
- Registry registration (`registerFrontendProjectAdapter`)
- Capability and diagnostics metadata

**Not imported** from:

- `apps/web` runtime
- `apps/mobile` runtime
- `@nexus/shared-ui`
- AppProviders or product provider hierarchy

## CI authentication

`.github/workflows/quality.yml` uses:

```yaml
permissions:
  contents: read
  packages: read

env:
  NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

With `actions/setup-node` configured for `registry-url: https://npm.pkg.github.com` and scope `@sujeetd7`.

## Validation

After install:

```powershell
pnpm test:engineering-platform
pnpm boundaries:check
pnpm verify
```

## Deferred integrations

- Figma MCP
- Code Connect
- OpenAPI
- RTK Query platform wiring
- Jira MCP
- AI Runtime

See `docs/sprint-5/BATCH_5_1G_COMPLETION_REPORT.md` for Batch 5.1G closeout.

## Reference

Platform consumer guide (authoritative for registry policy):  
`nexus-ai-engineering-platform/docs/setup/CONSUMER_INSTALLATION.md`
