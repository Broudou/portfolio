import type { Request, Response } from 'express';
import type { CreatePublicationInput, UpdatePublicationInput } from '@portfolio/shared';
import { Publication } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const listPublications = asyncHandler(async (_req: Request, res: Response) => {
  const publications = await Publication.find().sort({ date: -1 }).populate('coverImage');
  sendSuccess(res, publications);
});

export const createPublication = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreatePublicationInput;
  const publication = await Publication.create(input);
  sendSuccess(res, publication, 201);
});

export const updatePublication = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as UpdatePublicationInput;
  const publication = await Publication.findByIdAndUpdate(req.params.id, input, {
    new: true,
    runValidators: true,
  });
  if (!publication) throw ApiError.notFound('Publication');
  sendSuccess(res, publication);
});

export const deletePublication = asyncHandler(async (req: Request, res: Response) => {
  const publication = await Publication.findByIdAndDelete(req.params.id);
  if (!publication) throw ApiError.notFound('Publication');
  sendSuccess(res, { deleted: true });
});
