export interface StreamingRequest {
  endpoint: string;

  payload?: unknown;
}

export interface StreamingConnection {
  connect(): Promise<void>;

  disconnect(): Promise<void>;
}
