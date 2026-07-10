import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { ApiError } from '../utils/ApiError.js';

type Target = 'body' | 'query' | 'params';

/** Validates `req[target]` against a zod schema, replacing it with the parsed (and coerced/defaulted) value. */
export function validate(schema: ZodTypeAny, target: Target = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      next(ApiError.badRequest('Validation failed', result.error.flatten()));
      return;
    }
    req[target] = result.data;
    next();
  };
}
