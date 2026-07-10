import type { Request, Response } from 'express';
import type { CreateNavigationItemInput, UpdateNavigationItemInput } from '@portfolio/shared';
import { NavigationItem } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const listVisibleNavigation = asyncHandler(async (_req: Request, res: Response) => {
  const items = await NavigationItem.find({ isVisible: true }).sort({ order: 1 });
  sendSuccess(res, items);
});

export const listAllNavigation = asyncHandler(async (_req: Request, res: Response) => {
  const items = await NavigationItem.find().sort({ order: 1 });
  sendSuccess(res, items);
});

export const createNavigationItem = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateNavigationItemInput;
  const item = await NavigationItem.create(input);
  sendSuccess(res, item, 201);
});

export const updateNavigationItem = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as UpdateNavigationItemInput;
  const item = await NavigationItem.findByIdAndUpdate(req.params.id, input, {
    new: true,
    runValidators: true,
  });
  if (!item) throw ApiError.notFound('Navigation item');
  sendSuccess(res, item);
});

export const deleteNavigationItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await NavigationItem.findByIdAndDelete(req.params.id);
  if (!item) throw ApiError.notFound('Navigation item');
  sendSuccess(res, { deleted: true });
});

export const reorderNavigation = asyncHandler(async (req: Request, res: Response) => {
  const { items } = req.body as { items: { id: string; order: number }[] };
  await Promise.all(
    items.map(({ id, order }) => NavigationItem.updateOne({ _id: id }, { $set: { order } })),
  );
  sendSuccess(res, { reordered: items.length });
});
