import type { PublicClientConfig } from '@nexus/shared-types';

import { createMobileLogger } from '../src/platform/logging';

const developmentConfig: PublicClientConfig = {
  buildMode: 'development',
  apiBaseUrl: 'http://localhost:3000/api',
  graphqlUrl: 'http://localhost:3000/graphql',
  appName: 'Nexus Mobile',
  isDevelopment: true,
  isProduction: false,
};

const productionConfig: PublicClientConfig = {
  ...developmentConfig,
  buildMode: 'production',
  isDevelopment: false,
  isProduction: true,
};

describe('createMobileLogger', () => {
  it('allows all levels in development and uses matching console methods', () => {
    const sink = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    const logger = createMobileLogger({
      config: developmentConfig,
      sink,
    });

    logger.debug('d', { ok: true });
    logger.info('i');
    logger.warn('w');
    logger.error('e');

    expect(sink.debug).toHaveBeenCalledWith('d', { ok: true });
    expect(sink.info).toHaveBeenCalledWith('i');
    expect(sink.warn).toHaveBeenCalledWith('w');
    expect(sink.error).toHaveBeenCalledWith('e');
  });

  it('suppresses debug and info in production', () => {
    const sink = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    const logger = createMobileLogger({
      config: productionConfig,
      sink,
    });

    logger.debug('d');
    logger.info('i');
    logger.warn('w');

    expect(sink.debug).not.toHaveBeenCalled();
    expect(sink.info).not.toHaveBeenCalled();
    expect(sink.warn).toHaveBeenCalledWith('w');
  });

  it('never throws when the sink throws', () => {
    const logger = createMobileLogger({
      config: developmentConfig,
      sink: {
        error() {
          throw new Error('sink failure');
        },
      },
    });

    expect(() => logger.error('boom', { password: 'x' })).not.toThrow();
  });

  it('defaults to noop in test mode without an injected sink', () => {
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    const logger = createMobileLogger({
      config: {
        ...developmentConfig,
        buildMode: 'test',
        isDevelopment: false,
      },
    });

    logger.debug('quiet');
    expect(debugSpy).not.toHaveBeenCalled();
    debugSpy.mockRestore();
  });
});
