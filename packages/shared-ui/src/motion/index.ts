export {
  MOTION_EASING,
  createCssTransition,
  createMotionStyle,
  resolveTransitionDuration,
  type CssTransitionOptions,
  type MotionDurationToken,
  type MotionEasingToken,
} from "./transitions";

/** Duration SoT re-export for motion consumers (same values as theme `motion`). */
export { animations as motionDurations } from "../theme/animations";
