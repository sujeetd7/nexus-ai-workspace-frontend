import fs from "node:fs";
import path from "node:path";

const WINDOWS_RESERVED_RE =
  /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;
const INVALID_SEGMENT_CHARS_RE = /[<>:"|?*\u0000-\u001f]/;

export function findWorkspaceRoot(startDir = process.cwd()): string {
  let current = path.resolve(startDir);

  while (true) {
    if (fs.existsSync(path.join(current, "pnpm-workspace.yaml"))) {
      return current;
    }

    const parent = path.dirname(current);

    if (parent === current) {
      return path.resolve(startDir);
    }

    current = parent;
  }
}

export function isAbsolutePathInput(input: string): boolean {
  if (input.startsWith("/") || input.startsWith("\\")) {
    return true;
  }

  // UNC paths: \\server\share or //server/share
  if (input.startsWith("\\\\") || input.startsWith("//")) {
    return true;
  }

  // Windows drive-rooted or drive-relative (C:\..., C:/..., C:foo)
  if (/^[A-Za-z]:/.test(input)) {
    return true;
  }

  return path.win32.isAbsolute(input) || path.posix.isAbsolute(input);
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function assertSafePathSegment(
  segment: string,
  label = "Path segment",
): void {
  const decoded = decodeSegment(segment);

  if (!decoded || decoded === "." || decoded === "..") {
    throw new Error(`${label} is invalid: "${segment}"`);
  }

  if (
    decoded !== segment &&
    (decoded.includes("/") ||
      decoded.includes("\\") ||
      decoded === ".." ||
      decoded.includes(".."))
  ) {
    throw new Error(`${label} contains encoded traversal: "${segment}"`);
  }

  if (INVALID_SEGMENT_CHARS_RE.test(decoded)) {
    throw new Error(`${label} contains invalid characters: "${segment}"`);
  }

  if (/[. ]$/.test(decoded)) {
    throw new Error(`${label} must not end with a space or dot: "${segment}"`);
  }

  if (WINDOWS_RESERVED_RE.test(decoded)) {
    throw new Error(`${label} uses a reserved name: "${segment}"`);
  }
}

export function validateName(name: string): string {
  const trimmed = name.trim();

  if (!trimmed) {
    throw new Error("Name is required.");
  }

  if (/[/\\]/.test(trimmed)) {
    throw new Error(`Invalid name: "${name}"`);
  }

  assertSafePathSegment(trimmed, "Name");

  return trimmed;
}

/**
 * Resolves a user-supplied output path.
 * Absolute paths are rejected; results must stay inside the workspace root
 * after symlink/realpath resolution.
 */
export function resolveOutputPath(
  targetPath: string,
  cwd = process.cwd(),
  workspaceRoot = findWorkspaceRoot(cwd),
): string {
  const trimmed = targetPath.trim();

  if (!trimmed) {
    throw new Error("Path cannot be empty.");
  }

  if (isAbsolutePathInput(trimmed)) {
    throw new Error(`Absolute paths are not allowed: "${targetPath}"`);
  }

  const segments = trimmed.split(/[/\\]+/).filter(Boolean);

  for (const segment of segments) {
    assertSafePathSegment(segment);
  }

  const resolvedRoot = path.resolve(workspaceRoot);
  const resolved = path.resolve(cwd, ...segments);
  const relativeToRoot = path.relative(resolvedRoot, resolved);

  if (
    relativeToRoot.startsWith("..") ||
    path.isAbsolute(relativeToRoot)
  ) {
    throw new Error(`Path escapes workspace root: "${targetPath}"`);
  }

  return ensureRealPathInsideRoot(resolved, resolvedRoot);
}

export function ensureRealPathInsideRoot(
  candidate: string,
  root: string,
): string {
  const realRoot = fs.realpathSync(root);

  const missing: string[] = [];
  let current = path.normalize(candidate);

  while (!fs.existsSync(current)) {
    const parent = path.dirname(current);

    if (parent === current) {
      break;
    }

    missing.unshift(path.basename(current));
    current = parent;
  }

  if (!fs.existsSync(current)) {
    throw new Error(`Unable to resolve path within workspace: "${candidate}"`);
  }

  const realExisting = fs.realpathSync(current);
  const realCandidate =
    missing.length > 0 ? path.join(realExisting, ...missing) : realExisting;
  const relative = path.relative(realRoot, realCandidate);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(
      `Path escapes workspace root via symlink or resolution: "${candidate}"`,
    );
  }

  return path.normalize(realCandidate);
}
