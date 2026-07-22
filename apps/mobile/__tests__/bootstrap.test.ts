import {
  bootstrapMobileApp,
  resetMobileBootstrapForTests,
  retryMobileBootstrap,
} from '../src/bootstrap/bootstrapApp';
import { createAppStore } from '../src/store/createAppStore';
import { createMobileEnv } from '../src/config/env';
import { BOOTSTRAP_FAILURE_CODES } from '@nexus/shared-types';
import { createMemoryLogger } from '@nexus/shared-utils';

describe('bootstrapMobileApp', () => {
  beforeEach(() => {
    resetMobileBootstrapForTests();
  });

  it('initializes once with store, saga, and http client', () => {
    const logger = createMemoryLogger();
    const first = bootstrapMobileApp({
      configSource: {
        buildMode: 'test',
        apiBaseUrl: 'http://localhost:3000/api',
        graphqlUrl: 'http://localhost:3000/graphql',
        appName: 'Nexus Mobile Test',
      },
      logger,
    });

    expect(first.status).toBe('ready');
    if (first.status !== 'ready') {
      return;
    }

    expect(first.runtime.store.getState()).toHaveProperty('api');
    expect(first.runtime.store.getState()).not.toHaveProperty('auth');
    expect(first.runtime.httpClient).toBeTruthy();

    const second = bootstrapMobileApp();
    expect(second.status).toBe('ready');
    if (second.status === 'ready') {
      expect(second.runtime.store).toBe(first.runtime.store);
    }
  });

  it('returns configuration failure for invalid source', () => {
    const logger = createMemoryLogger();
    const outcome = bootstrapMobileApp({
      configSource: {
        buildMode: 'nope' as 'test',
        apiBaseUrl: 'http://localhost:3000/api',
        graphqlUrl: 'http://localhost:3000/graphql',
      },
      logger,
    });

    expect(outcome.status).toBe('failed');
    if (outcome.status === 'failed') {
      expect(outcome.failure.code).toBe(
        BOOTSTRAP_FAILURE_CODES.CONFIGURATION_INVALID,
      );
      expect(outcome.failure.retryable).toBe(true);
    }
  });

  it('retries after failure', () => {
    const logger = createMemoryLogger();
    const failed = bootstrapMobileApp({
      configSource: {
        buildMode: 'bad' as 'test',
        apiBaseUrl: 'http://localhost:3000/api',
        graphqlUrl: 'http://localhost:3000/graphql',
      },
      logger,
    });
    expect(failed.status).toBe('failed');

    const recovered = retryMobileBootstrap({
      configSource: {
        buildMode: 'test',
        apiBaseUrl: 'http://localhost:3000/api',
        graphqlUrl: 'http://localhost:3000/graphql',
      },
      logger,
    });
    expect(recovered.status).toBe('ready');
  });
});

describe('mobile createAppStore', () => {
  it('creates isolated stores with RTK middleware and no feature reducers', () => {
    const config = createMobileEnv({
      buildMode: 'test',
      apiBaseUrl: 'http://localhost:3000/api',
      graphqlUrl: 'http://localhost:3000/graphql',
    });

    const a = createAppStore({ config, startSaga: true });
    const b = createAppStore({ config, startSaga: false });

    expect(a.store).not.toBe(b.store);
    expect(a.sagaStarted).toBe(true);
    expect(b.sagaStarted).toBe(false);
    expect(Object.keys(a.store.getState())).toEqual(['api']);
  });
});
