import { graphqlClient } from "./client";

import type { GraphQLRequest, GraphQLResponse } from "./types";

export async function graphqlBaseQuery<T>(
  request: GraphQLRequest,
): Promise<GraphQLResponse<T>> {
  const response = await graphqlClient.post("", request);

  return response.data;
}
