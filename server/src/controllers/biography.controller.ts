import type { Request, Response } from 'express';
import type { UpdateBiographyInput } from '@portfolio/shared';
import { Biography, type BiographyDocument } from '../models/index.js';
import { getOrCreateSingleton, updateSingleton } from '../services/singleton.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

const DEFAULTS: Partial<BiographyDocument> = {
  fullName: 'New Engineer',
  headline: 'Software Engineer',
  summary: 'Add a short summary from the admin panel.',
  bioMarkdown: 'Write your biography from the admin panel.',
  highlights: [],
  background: { type: 'none', media: null },
};

const POPULATE = ['avatar', 'background.media'];

export const getBiography = asyncHandler(async (_req: Request, res: Response) => {
  const biography = await getOrCreateSingleton(Biography, DEFAULTS, POPULATE);
  sendSuccess(res, biography.toJSON());
});

export const updateBiography = asyncHandler(async (req: Request, res: Response) => {
  const patch = req.body as UpdateBiographyInput;
  const biography = await updateSingleton(Biography, patch, POPULATE);
  sendSuccess(res, biography.toJSON());
});
