import { StreamingClient } from "./StreamingClient";

class StreamingManager {
  readonly client = new StreamingClient();
}

export const streamingManager = new StreamingManager();
