import { describe, expect, it, vi } from "vitest";

import type {
  AppError,
  BuildMode,
  CursorPageRequest,
  CursorPageResponse,
  Err,
  EntityId,
  ISODateString,
  ISODateTimeString,
  Logger,
  Maybe,
  Nullable,
  Ok,
  Optional,
  PageRequest,
  PageResponse,
  PublicClientConfig,
  Result,
  StorageAdapter,
} from "./index";

describe("@nexus/shared-types public contracts", () => {
  it("supports Result discriminant shapes", () => {
    const ok: Ok<number> = { ok: true, value: 42 };
    const err: Err<string> = { ok: false, error: "failed" };
    const result: Result<number, string> = ok;

    expect(ok.ok).toBe(true);
    expect(ok.value).toBe(42);
    expect(err.ok).toBe(false);
    expect(err.error).toBe("failed");
    expect(result.ok).toBe(true);
  });

  it("supports pagination request and response shapes", () => {
    const pageRequest: PageRequest = { page: 1, pageSize: 20 };
    const pageResponse: PageResponse<string> = {
      items: ["a"],
      total: 1,
      page: 1,
      pageSize: 20,
      hasNext: false,
    };
    const cursorRequest: CursorPageRequest = { limit: 10, cursor: "c1" };
    const cursorResponse: CursorPageResponse<string> = {
      items: ["a"],
      nextCursor: undefined,
      hasNext: false,
    };

    expect(pageRequest.pageSize).toBe(20);
    expect(pageResponse.items).toHaveLength(1);
    expect(cursorRequest.limit).toBe(10);
    expect(cursorResponse.hasNext).toBe(false);
  });

  it("supports AppError, Logger, and StorageAdapter contracts", async () => {
    const error: AppError = {
      code: "VALIDATION",
      message: "Invalid input",
      retryable: false,
      metadata: { field: "email" },
    };

    const logger: Logger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    const store = new Map<string, string>();
    const storage: StorageAdapter = {
      getItem: (key) => store.get(key) ?? null,
      setItem: (key, value) => {
        store.set(key, value);
      },
      removeItem: (key) => {
        store.delete(key);
      },
      clear: () => {
        store.clear();
      },
    };

    logger.info("hello", { error });
    await storage.setItem("k", "v");
    expect(await storage.getItem("k")).toBe("v");
    expect(error.message).toBe("Invalid input");
    expect(logger.info).toHaveBeenCalled();
  });

  it("supports nullable and branded type aliases at the type level", () => {
    const nullable: Nullable<string> = null;
    const optional: Optional<number> = undefined;
    const maybe: Maybe<boolean> = true;
    const userId = "user-1" as EntityId<"User">;
    const date = "2026-07-22" as ISODateString;
    const dateTime = "2026-07-22T05:30:00.000Z" as ISODateTimeString;

    expect(nullable).toBeNull();
    expect(optional).toBeUndefined();
    expect(maybe).toBe(true);
    expect(userId).toBe("user-1");
    expect(date).toBe("2026-07-22");
    expect(dateTime).toContain("2026-07-22");
  });

  it("supports PublicClientConfig and BuildMode contracts", () => {
    const buildMode: BuildMode = "development";
    const config: PublicClientConfig = {
      buildMode,
      apiBaseUrl: "http://localhost:3000/api",
      graphqlUrl: "http://localhost:3000/graphql",
      appName: "Nexus AI Workspace",
      isDevelopment: true,
      isProduction: false,
    };

    expect(config.buildMode).toBe("development");
    expect(config.isDevelopment).toBe(true);
  });

  it("exposes registry and lifecycle contracts without implementations", async () => {
    const {
      FEATURE_LIFECYCLE_STAGES,
      PLATFORM_EXTENSION_KEYS,
      PLATFORM_SERVICE_KEYS,
      REGISTRATION_FAILURE_CODES,
    } = await import("./index");

    expect(PLATFORM_SERVICE_KEYS.LOGGER).toBe("logger");
    expect(PLATFORM_EXTENSION_KEYS.AI_PROVIDER).toBe("aiProvider");
    expect(FEATURE_LIFECYCLE_STAGES.REGISTER).toBe("register");
    expect(REGISTRATION_FAILURE_CODES.DUPLICATE_FEATURE_ID).toBe(
      "DUPLICATE_FEATURE_ID",
    );
  });
});

describe("@nexus/shared-types navigation contracts", () => {
  it("exposes stable infrastructure route IDs and catalog metadata", async () => {
    const {
      INFRASTRUCTURE_ROUTES,
      ROUTE_IDS,
      findDuplicateRouteIds,
      isNavigationAllowed,
    } = await import("./index");

    expect(ROUTE_IDS.HOME).toBe("home");
    expect(ROUTE_IDS.NOT_FOUND).toBe("not-found");
    expect(INFRASTRUCTURE_ROUTES.home.id).toBe(ROUTE_IDS.HOME);
    expect(INFRASTRUCTURE_ROUTES.home.webPath).toBe("/");
    expect(INFRASTRUCTURE_ROUTES.home.mobileName).toBe("Home");
    expect(INFRASTRUCTURE_ROUTES["not-found"].kind).toBe("system");

    const duplicates = findDuplicateRouteIds([
      INFRASTRUCTURE_ROUTES.home,
      INFRASTRUCTURE_ROUTES["not-found"],
      INFRASTRUCTURE_ROUTES.home,
    ]);
    expect(duplicates).toEqual([ROUTE_IDS.HOME]);
    expect(findDuplicateRouteIds(Object.values(INFRASTRUCTURE_ROUTES))).toEqual(
      [],
    );

    expect(isNavigationAllowed({ allowed: true })).toBe(true);
    expect(
      isNavigationAllowed({
        allowed: false,
        reason: "blocked",
        redirectTo: ROUTE_IDS.HOME,
      }),
    ).toBe(false);
  });
});
