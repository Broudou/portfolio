import { Router } from 'express';
import {
  createNavigationItemSchema,
  reorderNavigationSchema,
  updateNavigationItemSchema,
} from '@portfolio/shared';
import {
  createNavigationItem,
  deleteNavigationItem,
  listAllNavigation,
  listVisibleNavigation,
  reorderNavigation,
  updateNavigationItem,
} from '../../controllers/navigation.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';

export const navigationRouter = Router();

navigationRouter.get('/', listVisibleNavigation);
navigationRouter.get('/all', requireAuth, listAllNavigation);
navigationRouter.patch(
  '/reorder',
  requireAuth,
  validate(reorderNavigationSchema),
  reorderNavigation,
);
navigationRouter.post('/', requireAuth, validate(createNavigationItemSchema), createNavigationItem);
navigationRouter.put('/:id', requireAuth, validate(updateNavigationItemSchema), updateNavigationItem);
navigationRouter.delete('/:id', requireAuth, deleteNavigationItem);
