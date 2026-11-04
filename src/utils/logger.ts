type LogLevel = 'error' | 'warn' | 'info';

function log(level: LogLevel, message: string, details?: unknown): void {
  // Thin wrapper so call sites stay free of console.*; replaceable later.
  // eslint-disable-next-line no-console
  const sink = console[level].bind(console);

  if (details !== undefined) {
    sink(message, details);
    return;
  }

  sink(message);
}

export const logger = {
  error(message: string, details?: unknown): void {
    log('error', message, details);
  },
  warn(message: string, details?: unknown): void {
    log('warn', message, details);
  },
  info(message: string, details?: unknown): void {
    log('info', message, details);
  },
};
