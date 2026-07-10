import { env } from './config/env.js';
import { createApp } from './app.js';
import { connectDatabase } from './db/connect.js';
import { runSeed } from './seed/index.js';
import { logger } from './utils/logger.js';

async function bootstrap(): Promise<void> {
  await connectDatabase();
  await runSeed();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info(`API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((error) => {
  logger.error({ err: error }, 'Fatal error during startup');
  process.exit(1);
});
