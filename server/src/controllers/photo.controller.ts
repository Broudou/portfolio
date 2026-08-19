import fs from 'node:fs/promises';
import path from 'node:path';
import type { Request, Response } from 'express';
import type { UpdatePhotoInput } from '@portfolio/shared';
import { Album, Media, Photo } from '../models/index.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const listPhotosByAlbum = asyncHandler(async (req: Request, res: Response) => {
  const album = await Album.findById(req.params.albumId);
  if (!album) throw ApiError.notFound('Album');
  if (album.status !== 'published' && !req.user) throw ApiError.notFound('Album');

  const photos = await Photo.find({ album: album.id }).sort({ order: 1 }).populate('image');
  sendSuccess(res, photos);
});

export const addPhotos = asyncHandler(async (req: Request, res: Response) => {
  const album = await Album.findById(req.params.albumId);
  if (!album) throw ApiError.notFound('Album');

  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  if (files.length === 0) throw ApiError.badRequest('No files were uploaded');

  const lastPhoto = await Photo.findOne({ album: album.id }).sort({ order: -1 });
  let nextOrder = (lastPhoto?.order ?? -1) + 1;

  const created = [];
  for (const file of files) {
    const media = await Media.create({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      altText: album.title,
      uploadedBy: req.user!.id,
    });

    const photo = await Photo.create({
      album: album.id,
      image: media.id,
      caption: '',
      order: nextOrder,
    });
    nextOrder += 1;
    created.push(await photo.populate('image'));
  }

  sendSuccess(res, created, 201);
});

export const updatePhoto = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as UpdatePhotoInput;
  const photo = await Photo.findByIdAndUpdate(req.params.id, input, {
    new: true,
    runValidators: true,
  }).populate('image');
  if (!photo) throw ApiError.notFound('Photo');
  sendSuccess(res, photo);
});

export const deletePhoto = asyncHandler(async (req: Request, res: Response) => {
  const photo = await Photo.findByIdAndDelete(req.params.id).populate('image');
  if (!photo) throw ApiError.notFound('Photo');

  const media = photo.image as unknown as { id: string; filename: string } | null;
  if (media) {
    await Media.findByIdAndDelete(media.id);
    await fs.unlink(path.join(env.UPLOAD_DIR, media.filename)).catch(() => {
      // File already missing on disk — nothing further to clean up.
    });
  }

  sendSuccess(res, { deleted: true });
});

export const reorderPhotos = asyncHandler(async (req: Request, res: Response) => {
  const { items } = req.body as { items: { id: string; order: number }[] };
  await Promise.all(
    items.map(({ id, order }) => Photo.updateOne({ _id: id }, { $set: { order } })),
  );
  sendSuccess(res, { reordered: items.length });
});
