const IDENTIFIER_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;

export function splitName(input: string): string[] {
  const normalized = input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[\s\-./\\]+/g, " ")
    .trim();

  if (!normalized) {
    throw new Error("Name cannot be empty.");
  }

  return normalized.split(/\s+/).map((part) => part.toLowerCase());
}

export function toPascalCase(input: string): string {
  return splitName(input)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function toCamelCase(input: string): string {
  const pascal = toPascalCase(input);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function ensureHookName(input: string): string {
  const camel = toCamelCase(input);
  const name = camel.startsWith("use") ? camel : `use${toPascalCase(input)}`;
  assertIdentifier(name, "Hook name");
  return name;
}

export function assertIdentifier(name: string, label = "Name"): void {
  if (!IDENTIFIER_RE.test(name)) {
    throw new Error(`${label} must be a valid identifier. Received: "${name}"`);
  }
}
