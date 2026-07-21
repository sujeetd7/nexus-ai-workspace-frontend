export interface GraphQLRequest {
  query: string;

  variables?: Record<string, unknown>;
}

export interface GraphQLResponse<T> {
  data?: T;

  errors?: unknown[];
}
