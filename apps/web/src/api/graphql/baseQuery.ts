import { createGraphQLBaseQuery } from "@nexus/shared-network";

import { graphqlClient } from "./client";
import type { GraphQLRequest } from "./types";

const runGraphQLBaseQuery = createGraphQLBaseQuery(graphqlClient);

export async function graphqlBaseQuery<T>(
  request: GraphQLRequest,
  signal?: AbortSignal,
): Promise<T> {
  return runGraphQLBaseQuery<T>(request, signal);
}
