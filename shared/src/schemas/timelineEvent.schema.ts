import { z } from 'zod';
import { TIMELINE_EVENT_TYPES } from '../constants/enums.js';

export const createTimelineEventSchema = z.object({
  title: z.string().min(1).max(160),
  description: z.string().min(1).max(600),
  date: z.coerce.date(),
  endDate: z.coerce.date().nullish(),
  type: z.enum(TIMELINE_EVENT_TYPES),
  link: z.string().url().optional().or(z.literal('')),
});

export const updateTimelineEventSchema = createTimelineEventSchema.partial();

export type CreateTimelineEventInput = z.infer<typeof createTimelineEventSchema>;
export type UpdateTimelineEventInput = z.infer<typeof updateTimelineEventSchema>;
