import fs from 'node:fs/promises';
import path from 'node:path';
import type { Request, Response } from 'express';
import { Media } from '../models/index.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { buildPaginationMeta, sendPaginated, sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const listMedia = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 24));

  const [items, total] = await Promise.all([
    Media.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Media.countDocuments(),
  ]);

  sendPaginated(res, items, buildPaginationMeta(total, page, limit));
});

export const uploadMedia = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest('No file was uploaded');
  const altText = (req.body.altText as string | undefined)?.trim();
  if (!altText) throw ApiError.badRequest('altText is required for every uploaded asset');

  const media = await Media.create({
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`,
    mimeType: req.file.mimetype,
    sizeBytes: req.file.size,
    altText,
    uploadedBy: req.user!.id,
  });

  sendSuccess(res, media, 201);
});

export const updateMedia = asyncHandler(async (req: Request, res: Response) => {
  const media = await Media.findByIdAndUpdate(
    req.params.id,
    { altText: req.body.altText },
    { new: true, runValidators: true },
  );
  if (!media) throw ApiError.notFound('Media');
  sendSuccess(res, media);
});

export const deleteMedia = asyncHandler(async (req: Request, res: Response) => {
  const media = await Media.findByIdAndDelete(req.params.id);
  if (!media) throw ApiError.notFound('Media');

  const filePath = path.join(env.UPLOAD_DIR, media.filename);
  await fs.unlink(filePath).catch(() => {
    // File already missing on disk — nothing further to clean up.
  });

  sendSuccess(res, { deleted: true });
});
