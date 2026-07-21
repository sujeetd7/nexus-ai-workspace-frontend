import type { AxiosInstance } from "axios";

import { ApiError, normalizeApiError } from "../errors";

export interface GraphQLRequest {
  query: string;
  variables?: Record<string, unknown>;
}

export interface GraphQLErrorShape {
  message: string;
  extensions?: {
    code?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLErrorShape[];
}

export interface CreateGraphQLBaseQueryOptions {
  /**
   * GraphQL partial-data policy:
   * - false (default): any `errors[]` entry fails the request even if `data` is present.
   * - true: return `data` when present and ignore `errors[]` (not recommended for auth/mutations).
   */
  allowPartialData?: boolean;
}

/**
 * Creates a GraphQL executor on top of the shared Axios client.
 *
 * Partial-data behavior (Sprint 0 default): fail closed when `errors[]` is
 * non-empty. Callers that intentionally tolerate partial GraphQL payloads must
 * opt in via `allowPartialData: true`.
 */
export function createGraphQLBaseQuery(
  client: AxiosInstance,
  options: CreateGraphQLBaseQueryOptions = {},
) {
  const { allowPartialData = false } = options;

  return async function graphqlBaseQuery<T>(
    request: GraphQLRequest,
    signal?: AbortSignal,
  ): Promise<T> {
    try {
      const response = await client.post<GraphQLResponse<T>>("", request, {
        signal,
      });

      const hasErrors = Boolean(response.data.errors?.length);
      const hasData = response.data.data !== undefined;

      if (hasErrors && (!allowPartialData || !hasData)) {
        const first = response.data.errors?.[0];

        throw new ApiError({
          code: first?.extensions?.code,
          message: first?.message ?? "GraphQL request failed.",
          data: response.data.errors,
        });
      }

      if (!hasData) {
        throw new ApiError({
          message: "GraphQL response did not contain data.",
          data: response.data,
        });
      }

      return response.data.data as T;
    } catch (error) {
      throw normalizeApiError(error);
    }
  };
}
