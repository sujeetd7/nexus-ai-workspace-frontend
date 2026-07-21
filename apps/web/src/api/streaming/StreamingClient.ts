import type { StreamingConnection } from "./StreamingTypes";

export class StreamingClient implements StreamingConnection {
  async connect(): Promise<void> {}

  async disconnect(): Promise<void> {}

  async send(request: Request) {
    void request;
  }
}
