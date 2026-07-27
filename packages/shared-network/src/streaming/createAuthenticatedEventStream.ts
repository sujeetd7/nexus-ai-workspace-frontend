export interface AuthenticatedEventStreamOptions {
  readonly url: string;
  readonly accessToken: string;
  readonly signal?: AbortSignal;
  readonly headers?: Readonly<Record<string, string>>;
  readonly onEvent?: (event: MessageEvent<string>) => void;
  readonly onError?: (error: unknown) => void;
}

export interface AuthenticatedEventStream {
  readonly close: () => void;
}

/**
 * Authenticated SSE via fetch streaming (EventSource cannot send Authorization).
 * Parses `data:` lines from the response body incrementally.
 */
export async function createAuthenticatedEventStream(
  options: AuthenticatedEventStreamOptions,
): Promise<AuthenticatedEventStream> {
  const controller = new AbortController();
  const signal = options.signal
    ? AbortSignal.any([options.signal, controller.signal])
    : controller.signal;

  const response = await fetch(options.url, {
    method: "GET",
    headers: {
      Accept: "text/event-stream",
      Authorization: `Bearer ${options.accessToken}`,
      ...options.headers,
    },
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`SSE connection failed with status ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let closed = false;

  const pump = async (): Promise<void> => {
    while (!closed) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }

      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split("\n\n");
      buffer = chunks.pop() ?? "";

      for (const chunk of chunks) {
        const dataLine = chunk
          .split("\n")
          .find((line) => line.startsWith("data:"));

        if (!dataLine) {
          continue;
        }

        const data = dataLine.slice(5).trimStart();
        options.onEvent?.({ data } as MessageEvent<string>);
      }
    }
  };

  void pump().catch((error) => {
    if (!closed) {
      options.onError?.(error);
    }
  });

  return {
    close() {
      closed = true;
      controller.abort();
      void reader.cancel();
    },
  };
}
