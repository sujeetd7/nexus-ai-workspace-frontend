import type { AxiosError, AxiosRequestConfig, Method } from "axios";

export interface RetryPolicy {
  maxRetries: number;
  baseDelayMs: number;
  /** 0–1 fraction of exponential delay used as random jitter. */
  jitterRatio?: number;
  methods: Method[];
  shouldRetry?: (error: AxiosError) => boolean;
}

export const defaultRetryPolicy: RetryPolicy = {
  maxRetries: 3,
  baseDelayMs: 250,
  jitterRatio: 0.2,
  methods: ["GET", "HEAD", "OPTIONS"],
};

export function isRetryAllowed(
  config: AxiosRequestConfig,
  policy: RetryPolicy,
): boolean {
  const method = (config.method ?? "GET").toUpperCase() as Method;
  return policy.methods.includes(method);
}

/**
 * Default retry predicate.
 * 401/403 are excluded so auth refresh/session handling stays separate from
 * generic transport retries (see TD-006).
 */
export function defaultShouldRetry(error: AxiosError): boolean {
  const status = error.response?.status;

  if (status === 401 || status === 403) {
    return false;
  }

  return !error.response || (status !== undefined && status >= 500 && status < 600);
}

export function retryDelay(
  attempt: number,
  baseDelayMs = 250,
  jitterRatio = 0.2,
  random: () => number = Math.random,
): number {
  const exponential = baseDelayMs * 2 ** attempt;
  const ratio = Math.min(Math.max(jitterRatio, 0), 1);
  const jitter = exponential * ratio * random();
  return Math.round(exponential + jitter);
}
