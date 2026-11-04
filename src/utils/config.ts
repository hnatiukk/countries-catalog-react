import { readConfig, type AppConfig } from './readConfig';

export type { AppConfig, AppEnv, EnvSource } from './readConfig';
export { readConfig } from './readConfig';

export const config: AppConfig = readConfig(import.meta.env);
