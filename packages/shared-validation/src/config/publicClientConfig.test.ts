import { describe, expect, it } from "vitest";

import { ERROR_CODES, type PublicClientConfig } from "@nexus/shared-types";

import {
  DEFAULT_PUBLIC_APP_NAME,
  parsePublicClientConfig,
} from "./publicClientConfig";

const validInput = {
  buildMode: "development" as const,
  apiBaseUrl: "http://localhost:3000/api",
  graphqlUrl: "http://localhost:3000/graphql",
};

function expectConfigurationFailure(
  input: unknown,
  expectedFields?: string[],
): void {
  const result = parsePublicClientConfig(input);

  expect(result.ok).toBe(false);
  if (result.ok) {
    return;
  }

  expect(result.error.code).toBe(ERROR_CODES.CONFIGURATION);
  expect(result.error.message).toBe("Invalid public client configuration.");
  expect(result.error.message).not.toMatch(/https?:\/\//i);
  expect(JSON.stringify(result.error)).not.toMatch(/https?:\/\//i);
  expect(JSON.stringify(result.error)).not.toContain("localhost");
  expect(result.error).not.toHaveProperty("cause");
  expect(result.error.metadata).toBeDefined();

  if (expectedFields) {
    const fields = String(result.error.metadata?.fields ?? "");
    for (const field of expectedFields) {
      expect(fields).toContain(field);
    }
  }
}

describe("parsePublicClientConfig", () => {
  it("accepts valid configuration", () => {
    const result = parsePublicClientConfig({
      ...validInput,
      appName: "Nexus",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const config: PublicClientConfig = result.value;
    expect(config).toEqual({
      buildMode: "development",
      apiBaseUrl: "http://localhost:3000/api",
      graphqlUrl: "http://localhost:3000/graphql",
      appName: "Nexus",
      isDevelopment: true,
      isProduction: false,
    });
  });

  it("accepts development mode", () => {
    const result = parsePublicClientConfig({
      ...validInput,
      buildMode: "development",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.buildMode).toBe("development");
    expect(result.value.isDevelopment).toBe(true);
    expect(result.value.isProduction).toBe(false);
  });

  it("accepts test mode", () => {
    const result = parsePublicClientConfig({
      ...validInput,
      buildMode: "test",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.buildMode).toBe("test");
    expect(result.value.isDevelopment).toBe(false);
    expect(result.value.isProduction).toBe(false);
  });

  it("accepts production mode", () => {
    const result = parsePublicClientConfig({
      ...validInput,
      buildMode: "production",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.buildMode).toBe("production");
    expect(result.value.isDevelopment).toBe(false);
    expect(result.value.isProduction).toBe(true);
  });

  it("rejects missing API URL", () => {
    expectConfigurationFailure(
      {
        buildMode: "development",
        graphqlUrl: validInput.graphqlUrl,
      },
      ["apiBaseUrl"],
    );
  });

  it("rejects missing GraphQL URL", () => {
    expectConfigurationFailure(
      {
        buildMode: "development",
        apiBaseUrl: validInput.apiBaseUrl,
      },
      ["graphqlUrl"],
    );
  });

  it("rejects empty API URL", () => {
    expectConfigurationFailure(
      {
        ...validInput,
        apiBaseUrl: "",
      },
      ["apiBaseUrl"],
    );
  });

  it("rejects empty GraphQL URL", () => {
    expectConfigurationFailure(
      {
        ...validInput,
        graphqlUrl: "",
      },
      ["graphqlUrl"],
    );
  });

  it("rejects whitespace-only URL", () => {
    expectConfigurationFailure(
      {
        ...validInput,
        apiBaseUrl: "   ",
      },
      ["apiBaseUrl"],
    );
  });

  it("rejects malformed URL", () => {
    expectConfigurationFailure(
      {
        ...validInput,
        apiBaseUrl: "not a url",
      },
      ["apiBaseUrl"],
    );
  });

  it("rejects relative URL", () => {
    expectConfigurationFailure(
      {
        ...validInput,
        graphqlUrl: "/graphql",
      },
      ["graphqlUrl"],
    );
  });

  it("rejects unsupported build mode", () => {
    expectConfigurationFailure(
      {
        ...validInput,
        buildMode: "staging",
      },
      ["buildMode"],
    );
  });

  it("defaults application name", () => {
    const result = parsePublicClientConfig(validInput);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.appName).toBe(DEFAULT_PUBLIC_APP_NAME);
  });

  it("trims application name", () => {
    const result = parsePublicClientConfig({
      ...validInput,
      appName: "  Nexus Trimmed  ",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.appName).toBe("Nexus Trimmed");
  });

  it("defaults whitespace-only application name", () => {
    const result = parsePublicClientConfig({
      ...validInput,
      appName: "   ",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.appName).toBe(DEFAULT_PUBLIC_APP_NAME);
  });

  it("derives development flag", () => {
    const result = parsePublicClientConfig({
      ...validInput,
      buildMode: "development",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.isDevelopment).toBe(true);
  });

  it("derives production flag", () => {
    const result = parsePublicClientConfig({
      ...validInput,
      buildMode: "production",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.isProduction).toBe(true);
  });

  it("returns a frozen configuration object", () => {
    const result = parsePublicClientConfig(validInput);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(Object.isFrozen(result.value)).toBe(true);
    expect(() => {
      (result.value as { appName: string }).appName = "mutated";
    }).toThrow();
  });

  it("rejects unknown fields", () => {
    expectConfigurationFailure(
      {
        ...validInput,
        secretKey: "should-not-pass",
      },
      ["config"],
    );
  });

  it("returns Configuration AppError result", () => {
    const result = parsePublicClientConfig({});

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(result.error.code).toBe(ERROR_CODES.CONFIGURATION);
  });

  it("does not expose raw URL in error message or metadata", () => {
    const result = parsePublicClientConfig({
      ...validInput,
      apiBaseUrl: "ftp://secret.example/private",
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    const serialized = JSON.stringify(result.error);
    expect(serialized).not.toContain("secret.example");
    expect(serialized).not.toContain("ftp://");
    expect(serialized).not.toContain("private");
  });

  it("does not expose raw input", () => {
    const input = {
      ...validInput,
      apiBaseUrl: "not-a-url",
      token: "super-secret",
    };
    const result = parsePublicClientConfig(input);

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    const serialized = JSON.stringify(result.error);
    expect(serialized).not.toContain("super-secret");
    expect(serialized).not.toContain("not-a-url");
    expect(result.error).not.toHaveProperty("input");
  });

  it("trims URL values before validation", () => {
    const result = parsePublicClientConfig({
      ...validInput,
      apiBaseUrl: "  http://localhost:3000/api  ",
      graphqlUrl: "  http://localhost:3000/graphql  ",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.apiBaseUrl).toBe("http://localhost:3000/api");
    expect(result.value.graphqlUrl).toBe("http://localhost:3000/graphql");
  });
});
