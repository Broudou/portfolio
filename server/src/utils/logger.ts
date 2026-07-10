import pino from 'pino';
import { env, isProduction } from '../config/env.js';

/**
 * Structured JSON logging in production (consumed natively by journald under
 * systemd); pretty-printed in development for readability.
 */
export const logger = pino({
  level: env.LOG_LEVEL,
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
      },
});
