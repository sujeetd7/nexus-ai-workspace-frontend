import fs from "node:fs";
import path from "node:path";

export const TEMPLATES_ROOT = path.join(
  process.cwd(),
  "scripts",
  "generators",
  "templates",
);

export function renderTemplate(
  templateContent: string,
  vars: Record<string, string>,
): string {
  return templateContent.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    if (!(key in vars)) {
      throw new Error(`Missing template variable: ${key}`);
    }

    return vars[key];
  });
}

export function loadTemplate(generator: string, fileName: string): string {
  const templatePath = path.join(TEMPLATES_ROOT, generator, fileName);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  return fs.readFileSync(templatePath, "utf8");
}
