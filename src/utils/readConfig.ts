export type AppEnv = ImportMetaEnv['VITE_APP_ENV'];

export interface AppConfig {
  apiBaseUrl: string;
  apiKey: string;
  appEnv: AppEnv;
}

export type EnvSource = Partial<
  Record<keyof ImportMetaEnv, string | undefined>
>;

function readRequired(env: EnvSource, name: keyof ImportMetaEnv): string {
  const value = env[name];

  if (typeof value !== 'string' || value.trim() === '') {
    if (name === 'VITE_API_KEY') {
      throw new Error(
        'Missing VITE_API_KEY. Create .env.local with VITE_API_KEY=<your key> from https://restcountries.com/sign-up (never commit the key).',
      );
    }

    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

/** Pure config reader — testable without the Jest `@/utils/config` mock. */
export function readConfig(env: EnvSource): AppConfig {
  return {
    apiBaseUrl: readRequired(env, 'VITE_API_BASE_URL'),
    apiKey: readRequired(env, 'VITE_API_KEY'),
    appEnv: readRequired(env, 'VITE_APP_ENV') as AppEnv,
  };
}
