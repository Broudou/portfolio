import type { Request, Response } from 'express';
import type { CreateTagInput, UpdateTagInput } from '@portfolio/shared';
import { Tag } from '../models/index.js';
import { generateUniqueSlug } from '../services/slug.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const listTags = asyncHandler(async (_req: Request, res: Response) => {
  const tags = await Tag.find().sort({ name: 1 });
  sendSuccess(res, tags);
});

export const createTag = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateTagInput;
  const slug = input.slug ?? (await generateUniqueSlug(Tag, input.name));
  const tag = await Tag.create({ ...input, slug });
  sendSuccess(res, tag, 201);
});

export const updateTag = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as UpdateTagInput;
  const tag = await Tag.findByIdAndUpdate(req.params.id, input, { new: true, runValidators: true });
  if (!tag) throw ApiError.notFound('Tag');
  sendSuccess(res, tag);
});

export const deleteTag = asyncHandler(async (req: Request, res: Response) => {
  const tag = await Tag.findByIdAndDelete(req.params.id);
  if (!tag) throw ApiError.notFound('Tag');
  sendSuccess(res, { deleted: true });
});
