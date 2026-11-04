export const config = {
  apiBaseUrl: '/api/countries/v5',
  apiKey: 'test-api-key',
  appEnv: 'test' as const,
};

export function readConfig() {
  return config;
}
