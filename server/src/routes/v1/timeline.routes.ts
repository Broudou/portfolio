import { Router } from 'express';
import { createTimelineEventSchema, updateTimelineEventSchema } from '@portfolio/shared';
import {
  createTimelineEvent,
  deleteTimelineEvent,
  listTimelineEvents,
  updateTimelineEvent,
} from '../../controllers/timelineEvent.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';

export const timelineRouter = Router();

timelineRouter.get('/', listTimelineEvents);
timelineRouter.post('/', requireAuth, validate(createTimelineEventSchema), createTimelineEvent);
timelineRouter.put('/:id', requireAuth, validate(updateTimelineEventSchema), updateTimelineEvent);
timelineRouter.delete('/:id', requireAuth, deleteTimelineEvent);
