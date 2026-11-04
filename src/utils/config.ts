function requireEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const config = {
  apiBaseUrl: requireEnv('VITE_API_BASE_URL'),
  appEnv: requireEnv('VITE_APP_ENV') as ImportMetaEnv['VITE_APP_ENV'],
} as const;
