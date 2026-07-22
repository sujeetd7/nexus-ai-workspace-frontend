import type { PublicClientConfig } from '@nexus/shared-types';

import { createMobileEnv } from '../src/config/env';
import type { MobilePublicConfigSource } from '../src/config/publicConfig';

const validSource: MobilePublicConfigSource = {
  buildMode: 'development',
  apiBaseUrl: 'http://localhost:3000/api',
  graphqlUrl: 'http://localhost:3000/graphql',
  appName: 'Nexus Mobile',
};

describe('createMobileEnv', () => {
  it('maps the local public configuration source', () => {
    const config = createMobileEnv(validSource);

    expect(config).toEqual({
      buildMode: 'development',
      apiBaseUrl: 'http://localhost:3000/api',
      graphqlUrl: 'http://localhost:3000/graphql',
      appName: 'Nexus Mobile',
      isDevelopment: true,
      isProduction: false,
    } satisfies PublicClientConfig);
  });

  it('uses the shared parser', () => {
    expect(() =>
      createMobileEnv({
        ...validSource,
        apiBaseUrl: 'not-a-url',
      }),
    ).toThrow('Invalid public client configuration.');
  });

  it('returns a frozen configuration object', () => {
    const config = createMobileEnv(validSource);

    expect(Object.isFrozen(config)).toBe(true);
  });

  it('fails when the source is missing required values', () => {
    expect(() =>
      createMobileEnv({
        buildMode: 'development',
        apiBaseUrl: '',
        graphqlUrl: validSource.graphqlUrl,
      }),
    ).toThrow('Invalid public client configuration.');
  });

  it('builds configuration from a plain typed source only', () => {
    const config = createMobileEnv({
      buildMode: 'test',
      apiBaseUrl: 'http://127.0.0.1:3000/api',
      graphqlUrl: 'http://127.0.0.1:3000/graphql',
    });

    expect(config.buildMode).toBe('test');
    expect(config.apiBaseUrl).toBe('http://127.0.0.1:3000/api');
    expect(config.isDevelopment).toBe(false);
    expect(config.isProduction).toBe(false);
  });

  it('does not require browser or Vite environment APIs to produce config', () => {
    // Adapter accepts only a plain typed source; no window/document/import.meta.
    const config = createMobileEnv(validSource);

    expect(config.appName).toBe('Nexus Mobile');
    expect(Object.prototype.hasOwnProperty.call(config, 'VITE_API_URL')).toBe(
      false,
    );
  });

  it('does not export raw source fields on the configuration', () => {
    const config = createMobileEnv(validSource) as unknown as Record<
      string,
      unknown
    >;

    expect(Object.keys(config)).toEqual([
      'buildMode',
      'apiBaseUrl',
      'graphqlUrl',
      'appName',
      'isDevelopment',
      'isProduction',
    ]);
  });

  it('does not include secret-like fields', () => {
    const config = createMobileEnv(validSource) as unknown as Record<
      string,
      unknown
    >;

    expect(config).not.toHaveProperty('secret');
    expect(config).not.toHaveProperty('token');
    expect(config).not.toHaveProperty('apiKey');
    expect(config).not.toHaveProperty('password');
  });
});
