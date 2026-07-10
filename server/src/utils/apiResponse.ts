import type { Response } from 'express';
import type { ApiFailure, ApiSuccess, PaginatedResponse, PaginationMeta } from '@portfolio/shared';

export function sendSuccess<T>(res: Response, data: T, status = 200): Response<ApiSuccess<T>> {
  return res.status(status).json({ success: true, data });
}

export function sendPaginated<T>(
  res: Response,
  items: T[],
  meta: PaginationMeta,
  status = 200,
): Response<ApiSuccess<PaginatedResponse<T>>> {
  return res.status(status).json({ success: true, data: { items, meta } });
}

export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  return { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: unknown,
): Response<ApiFailure> {
  return res.status(status).json({ success: false, error: { code, message, details } });
}
