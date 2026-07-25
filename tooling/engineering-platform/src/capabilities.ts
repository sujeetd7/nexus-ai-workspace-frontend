import { PROJECT_CAPABILITIES } from "@sujeetd7/ai-engineering-project-adapter-contracts";
import type { ProjectCapabilityDescriptor } from "@sujeetd7/ai-engineering-project-adapter-contracts";

/**
 * Declared capability metadata for tooling surfaces that exist today.
 * Does not enable platform features — metadata only.
 */
export const FRONTEND_CAPABILITY_METADATA: readonly ProjectCapabilityDescriptor[] =
  Object.freeze([
    {
      capability: PROJECT_CAPABILITIES.REACT,
      description: "React web application (apps/web)",
    },
    {
      capability: PROJECT_CAPABILITIES.REACT_NATIVE,
      description: "React Native mobile application (apps/mobile)",
    },
    {
      capability: PROJECT_CAPABILITIES.STORYBOOK,
      description: "Web Storybook component catalog (apps/web)",
    },
    {
      capability: PROJECT_CAPABILITIES.CI_CD,
      description: "GitHub Actions quality workflow (.github/workflows/quality.yml)",
    },
    {
      capability: PROJECT_CAPABILITIES.OTHER,
      description: "Diagnostics metadata for repository quality gates",
      features: {
        surface: "diagnostics",
        script: "verify",
      },
    },
    {
      capability: PROJECT_CAPABILITIES.OTHER,
      description: "Architecture validation via import boundary checks",
      features: {
        surface: "architecture-validation",
        script: "boundaries:check",
      },
    },
    {
      capability: PROJECT_CAPABILITIES.OTHER,
      description: "Dependency validation via Syncpack policy",
      features: {
        surface: "dependency-validation",
        script: "deps:check",
      },
    },
  ]);
