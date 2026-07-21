import {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "../errors";
import { createHttpClient } from "./createHttpClient";

function okResponse(
  config: InternalAxiosRequestConfig,
  data: unknown = { ok: true },
): AxiosResponse {
  return {
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  };
}

describe("createHttpClient", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("attaches Authorization and X-Request-Id headers", async () => {
    const { client, ejectInterceptors } = createHttpClient({
      baseURL: "https://api.example.test",
      tokenProvider: {
        getAccessToken: () => "access-token",
      },
    });

    let captured: InternalAxiosRequestConfig | undefined;

    client.defaults.adapter = async (config) => {
      captured = config;
      return okResponse(config);
    };

    await client.get("/health");
    ejectInterceptors();

    expect(captured?.headers.get("Authorization")).toBe("Bearer access-token");
    expect(captured?.headers.get("X-Request-Id")).toBeTruthy();
  });

  it("retries safe methods on network failures and ejects interceptors", async () => {
    vi.useFakeTimers();

    const { client, ejectInterceptors } = createHttpClient({
      baseURL: "https://api.example.test",
      retryPolicy: {
        maxRetries: 2,
        baseDelayMs: 10,
        methods: ["GET"],
      },
    });

    let attempts = 0;

    client.defaults.adapter = async (config) => {
      attempts += 1;

      if (attempts < 3) {
        throw new AxiosError(
          "Network Error",
          "ERR_NETWORK",
          config,
          undefined,
          undefined,
        );
      }

      return okResponse(config, { attempts });
    };

    const request = client.get("/retry-me");
    await vi.runAllTimersAsync();
    const response = await request;

    expect(response.data).toEqual({ attempts: 3 });
    expect(attempts).toBe(3);

    ejectInterceptors();

    let postAttempts = 0;
    client.defaults.adapter = async (config) => {
      postAttempts += 1;
      throw new AxiosError(
        "Network Error",
        "ERR_NETWORK",
        config,
        undefined,
        undefined,
      );
    };

    await expect(client.get("/after-eject")).rejects.toBeInstanceOf(AxiosError);
    expect(postAttempts).toBe(1);
  });

  it("does not retry non-idempotent methods", async () => {
    const { client, ejectInterceptors } = createHttpClient({
      baseURL: "https://api.example.test",
    });

    let attempts = 0;

    client.defaults.adapter = async (config) => {
      attempts += 1;
      throw new AxiosError(
        "Network Error",
        "ERR_NETWORK",
        config,
        undefined,
        undefined,
      );
    };

    await expect(client.post("/create", { name: "x" })).rejects.toBeInstanceOf(
      ApiError,
    );
    expect(attempts).toBe(1);
    ejectInterceptors();
  });

  it("invokes unauthorized handler on 401 responses", async () => {
    const onUnauthorized = vi.fn();
    const { client, ejectInterceptors } = createHttpClient({
      baseURL: "https://api.example.test",
      unauthorizedHandler: { onUnauthorized },
    });

    client.defaults.adapter = async (config) => {
      throw new AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, undefined, {
        status: 401,
        statusText: "Unauthorized",
        headers: new AxiosHeaders(),
        config,
        data: {
          code: "UNAUTHORIZED",
          message: "Session expired.",
        },
      });
    };

    await expect(client.get("/secure")).rejects.toMatchObject({
      status: 401,
      code: "UNAUTHORIZED",
    });
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
    ejectInterceptors();
  });

  it("forwards AbortSignal to the underlying request", async () => {
    const { client, ejectInterceptors } = createHttpClient({
      baseURL: "https://api.example.test",
    });

    const controller = new AbortController();
    let seen: AbortSignal | undefined;

    client.defaults.adapter = async (config) => {
      seen = config.signal as AbortSignal | undefined;
      return okResponse(config);
    };

    await client.get("/ok", { signal: controller.signal });

    expect(seen).toBe(controller.signal);
    ejectInterceptors();
  });

  it("does not retry 401 responses", async () => {
    const { client, ejectInterceptors } = createHttpClient({
      baseURL: "https://api.example.test",
    });

    let attempts = 0;

    client.defaults.adapter = async (config) => {
      attempts += 1;
      throw new AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, undefined, {
        status: 401,
        statusText: "Unauthorized",
        headers: new AxiosHeaders(),
        config,
        data: { message: "nope" },
      });
    };

    await expect(client.get("/secure")).rejects.toMatchObject({ status: 401 });
    expect(attempts).toBe(1);
    ejectInterceptors();
  });

  it("attaches Idempotency-Key when idempotent is requested", async () => {
    const { client, ejectInterceptors } = createHttpClient({
      baseURL: "https://api.example.test",
    });

    let captured: InternalAxiosRequestConfig | undefined;

    client.defaults.adapter = async (config) => {
      captured = config;
      return okResponse(config);
    };

    await client.post("/payments", { amount: 1 }, { idempotent: true });

    expect(captured?.headers.get("Idempotency-Key")).toBeTruthy();
    ejectInterceptors();
  });

  it("does not stack interceptors when ensureInterceptors is called twice", async () => {
    const logger = { debug: vi.fn(), error: vi.fn() };
    const managed = createHttpClient({
      baseURL: "https://api.example.test",
      logger,
    });

    managed.client.defaults.adapter = async (config) => okResponse(config);

    managed.ensureInterceptors();
    managed.ensureInterceptors();

    await managed.client.get("/once");

    expect(logger.debug).toHaveBeenCalledTimes(1);

    managed.ejectInterceptors();
    managed.ensureInterceptors();

    await managed.client.get("/again");
    expect(logger.debug).toHaveBeenCalledTimes(2);
    managed.ejectInterceptors();
  });
});
