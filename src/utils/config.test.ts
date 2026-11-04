import { readConfig } from './readConfig';

describe('readConfig', () => {
  const validEnv = {
    VITE_API_BASE_URL: '/api/countries/v5',
    VITE_API_KEY: 'test-key-value',
    VITE_APP_ENV: 'test',
  };

  it('returns apiBaseUrl, apiKey, and appEnv from the env source', () => {
    expect(readConfig(validEnv)).toEqual({
      apiBaseUrl: '/api/countries/v5',
      apiKey: 'test-key-value',
      appEnv: 'test',
    });
  });

  it('throws a clear message when VITE_API_KEY is missing', () => {
    expect(() =>
      readConfig({
        ...validEnv,
        VITE_API_KEY: '',
      }),
    ).toThrow(/Missing VITE_API_KEY/);
  });

  it('throws when VITE_API_BASE_URL is missing', () => {
    expect(() =>
      readConfig({
        ...validEnv,
        VITE_API_BASE_URL: undefined,
      }),
    ).toThrow('Missing required environment variable: VITE_API_BASE_URL');
  });

  it('throws when VITE_APP_ENV is blank', () => {
    expect(() =>
      readConfig({
        ...validEnv,
        VITE_APP_ENV: '   ',
      }),
    ).toThrow('Missing required environment variable: VITE_APP_ENV');
  });
});
