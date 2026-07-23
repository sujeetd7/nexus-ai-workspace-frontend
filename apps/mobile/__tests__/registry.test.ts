/**
 * @format
 */

import { PLATFORM_SERVICE_KEYS } from '@nexus/shared-types';

import {
  bootstrapMobileApp,
  resetMobileBootstrapForTests,
} from '../src/bootstrap/bootstrapApp';
import { registerMobilePlatform } from '../src/platform/registry';

beforeEach(() => {
  resetMobileBootstrapForTests();
});

test('bootstrap registers and seals the mobile dependency registry', () => {
  const outcome = bootstrapMobileApp({ startSaga: false });
  expect(outcome.status).toBe('ready');
  if (outcome.status !== 'ready') {
    return;
  }

  expect(outcome.runtime.registry.isSealed()).toBe(true);
  expect(outcome.runtime.extensions.isSealed()).toBe(true);
  expect(outcome.runtime.featureOrder).toEqual([]);
  expect(outcome.runtime.registry.resolve(PLATFORM_SERVICE_KEYS.LOGGER)).toBe(
    outcome.runtime.logger,
  );
  expect(
    outcome.runtime.registry.resolve(PLATFORM_SERVICE_KEYS.HTTP_CLIENT),
  ).toBe(outcome.runtime.httpClient);
});

test('registerMobilePlatform rejects circular feature dependencies', () => {
  const logger = {
    debug: () => undefined,
    info: () => undefined,
    warn: () => undefined,
    error: () => undefined,
  };

  expect(() =>
    registerMobilePlatform({
      config: {
        buildMode: 'development',
        apiBaseUrl: 'http://localhost:3000/api',
        graphqlUrl: 'http://localhost:3000/graphql',
        appName: 'mobile-test',
        isDevelopment: true,
        isProduction: false,
      },
      logger,
      httpClient: {} as never,
      features: [
        {
          id: 'a',
          displayName: 'A',
          version: '1.0.0',
          dependencies: ['b'],
        },
        {
          id: 'b',
          displayName: 'B',
          version: '1.0.0',
          dependencies: ['a'],
        },
      ],
    }),
  ).toThrow(/Circular feature dependency/);
});
