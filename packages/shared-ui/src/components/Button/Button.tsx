/**
 * Default TypeScript / non-platform entry.
 * Metro resolves `Button.native.tsx` at runtime on native.
 * Vite/Vitest resolve `Button.web.tsx` when `.web.tsx` is preferred in resolve.extensions.
 */
export { Button } from "./Button.native";
