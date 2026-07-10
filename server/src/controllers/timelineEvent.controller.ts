import type { Request, Response } from 'express';
import type { CreateTimelineEventInput, UpdateTimelineEventInput } from '@portfolio/shared';
import { TimelineEvent } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const listTimelineEvents = asyncHandler(async (_req: Request, res: Response) => {
  const events = await TimelineEvent.find().sort({ date: 1 });
  sendSuccess(res, events);
});

export const createTimelineEvent = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateTimelineEventInput;
  const event = await TimelineEvent.create(input);
  sendSuccess(res, event, 201);
});

export const updateTimelineEvent = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as UpdateTimelineEventInput;
  const event = await TimelineEvent.findByIdAndUpdate(req.params.id, input, {
    new: true,
    runValidators: true,
  });
  if (!event) throw ApiError.notFound('Timeline event');
  sendSuccess(res, event);
});

export const deleteTimelineEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await TimelineEvent.findByIdAndDelete(req.params.id);
  if (!event) throw ApiError.notFound('Timeline event');
  sendSuccess(res, { deleted: true });
});
