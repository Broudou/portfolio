import { Router } from 'express';
import { createContactMessageSchema } from '@portfolio/shared';
import {
  createContactMessage,
  deleteContactMessage,
  getContactMessage,
  listContactMessages,
  markContactMessageRead,
} from '../../controllers/contactMessage.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { contactRateLimiter } from '../../middleware/rateLimit.middleware.js';

export const contactRouter = Router();

contactRouter.post(
  '/',
  contactRateLimiter,
  validate(createContactMessageSchema),
  createContactMessage,
);
contactRouter.get('/', requireAuth, listContactMessages);
contactRouter.get('/:id', requireAuth, getContactMessage);
contactRouter.patch('/:id/read', requireAuth, markContactMessageRead);
contactRouter.delete('/:id', requireAuth, deleteContactMessage);
