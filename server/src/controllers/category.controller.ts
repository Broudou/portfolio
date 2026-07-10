import type { Request, Response } from 'express';
import type { CreateCategoryInput, UpdateCategoryInput } from '@portfolio/shared';
import { Category } from '../models/index.js';
import { generateUniqueSlug } from '../services/slug.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await Category.find().sort({ name: 1 });
  sendSuccess(res, categories);
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateCategoryInput;
  const slug = input.slug ?? (await generateUniqueSlug(Category, input.name));
  const category = await Category.create({ ...input, slug });
  sendSuccess(res, category, 201);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as UpdateCategoryInput;
  const category = await Category.findByIdAndUpdate(req.params.id, input, {
    new: true,
    runValidators: true,
  });
  if (!category) throw ApiError.notFound('Category');
  sendSuccess(res, category);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw ApiError.notFound('Category');
  sendSuccess(res, { deleted: true });
});
