/**
 * Testing-oriented helpers that must not ship through the main runtime barrel.
 * Import via `@nexus/shared-ui/testing` from tests and tooling only.
 */
export {
  getContrastRatio,
  getContrastThreshold,
  meetsContrastRequirement,
  relativeLuminance,
  type ContrastLevel,
} from "../accessibility/contrast";
export {
  REQUIRED_CONTRAST_PAIRS,
  type ContrastPair,
} from "../accessibility/contrastPairs";
export { renderWithSharedUI } from "./render";
