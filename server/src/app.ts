import path from 'node:path';
import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { v1Router } from './routes/v1/index.js';
import { requestLogger } from './middleware/requestLogger.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGINS.length > 0 ? env.CORS_ORIGINS : false,
      credentials: false,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // Uploaded media is served directly by Express — this is the one path the
  // browser hits on this origin (via an absolute URL SvelteKit renders).
  app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR)));

  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

  app.use('/api/v1', v1Router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
