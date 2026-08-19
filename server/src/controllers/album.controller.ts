import fs from 'node:fs/promises';
import path from 'node:path';
import type { Request, Response } from 'express';
import type { CreateAlbumInput, UpdateAlbumInput } from '@portfolio/shared';
import { Album, Media, Photo } from '../models/index.js';
import { env } from '../config/env.js';
import { generateUniqueSlug } from '../services/slug.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { buildPaginationMeta, sendPaginated, sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const POPULATE = ['cover', 'seo.ogImage'];

export const listAlbums = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));
  const filter: Record<string, unknown> = {};

  // Anonymous callers only ever see published albums. An authenticated
  // admin/editor sees every status by default, or a specific one via ?status=.
  if (req.user) {
    if (req.query.status) filter.status = req.query.status;
  } else {
    filter.status = 'published';
  }

  const [items, total] = await Promise.all([
    Album.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(POPULATE),
    Album.countDocuments(filter),
  ]);

  sendPaginated(res, items, buildPaginationMeta(total, page, limit));
});

export const getAlbumBySlug = asyncHandler(async (req: Request, res: Response) => {
  const album = await Album.findOne({ slug: req.params.slug }).populate(POPULATE);
  if (!album) throw ApiError.notFound('Album');
  if (album.status !== 'published' && !req.user) throw ApiError.notFound('Album');
  sendSuccess(res, album);
});

export const createAlbum = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateAlbumInput;
  const slug = input.slug ?? (await generateUniqueSlug(Album, input.title));
  const album = await Album.create({ ...input, slug });
  sendSuccess(res, album, 201);
});

export const updateAlbum = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as UpdateAlbumInput;
  const album = await Album.findByIdAndUpdate(req.params.id, input, {
    new: true,
    runValidators: true,
  }).populate(POPULATE);
  if (!album) throw ApiError.notFound('Album');
  sendSuccess(res, album);
});

export const deleteAlbum = asyncHandler(async (req: Request, res: Response) => {
  const album = await Album.findByIdAndDelete(req.params.id);
  if (!album) throw ApiError.notFound('Album');

  const photos = await Photo.find({ album: album.id }).populate('image');
  await Promise.all(
    photos.map(async (photo) => {
      const media = photo.image as unknown as { id: string; filename: string } | null;
      if (!media) return;
      await Media.findByIdAndDelete(media.id);
      await fs.unlink(path.join(env.UPLOAD_DIR, media.filename)).catch(() => {
        // File already missing on disk — nothing further to clean up.
      });
    }),
  );
  await Photo.deleteMany({ album: album.id });

  sendSuccess(res, { deleted: true });
});

export const reorderAlbums = asyncHandler(async (req: Request, res: Response) => {
  const { items } = req.body as { items: { id: string; order: number }[] };
  await Promise.all(
    items.map(({ id, order }) => Album.updateOne({ _id: id }, { $set: { order } })),
  );
  sendSuccess(res, { reordered: items.length });
});
