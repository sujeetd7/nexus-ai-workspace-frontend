import { env } from "../../config/env";

export const logger = {
  debug: (...args: unknown[]) => {
    if (env.isDevelopment) {
      console.debug(...args);
    }
  },

  info: (...args: unknown[]) => {
    if (env.isDevelopment) {
      console.info(...args);
    }
  },

  warn: (...args: unknown[]) => {
    console.warn(...args);
  },

  error: (...args: unknown[]) => {
    console.error(...args);
  },
};
