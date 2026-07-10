import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { sendError } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, 404, 'NOT_FOUND', `Route not found: ${req.method} ${req.originalUrl}`);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    sendError(res, err.status, err.code, err.message, err.details);
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    sendError(res, 400, 'VALIDATION_ERROR', err.message, err.errors);
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    sendError(res, 400, 'INVALID_ID', `Invalid ${err.path}: ${err.value}`);
    return;
  }

  if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
    sendError(res, 409, 'DUPLICATE_KEY', 'A record with this value already exists', err.keyValue);
    return;
  }

  logger.error({ err }, 'Unhandled error');
  sendError(res, 500, 'INTERNAL_ERROR', 'Something went wrong. Please try again.');
}
