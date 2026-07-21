import path from "node:path";

export function validateName(name: string): string {
  const trimmed = name.trim();

  if (!trimmed) {
    throw new Error("Name is required.");
  }

  if (/[<>:"|?*\0]/.test(trimmed)) {
    throw new Error(`Invalid name: "${name}"`);
  }

  return trimmed;
}

export function resolveOutputPath(
  targetPath: string,
  cwd = process.cwd(),
): string {
  const trimmed = targetPath.trim();

  if (!trimmed) {
    throw new Error("Path cannot be empty.");
  }

  const segments = trimmed.split(/[/\\]+/).filter(Boolean);

  if (segments.some((segment) => segment === "..")) {
    throw new Error(`Path must not contain "..": "${targetPath}"`);
  }

  return path.resolve(cwd, trimmed);
}
