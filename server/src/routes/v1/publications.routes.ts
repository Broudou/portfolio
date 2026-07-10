import { Router } from 'express';
import { createPublicationSchema, updatePublicationSchema } from '@portfolio/shared';
import {
  createPublication,
  deletePublication,
  listPublications,
  updatePublication,
} from '../../controllers/publication.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';

export const publicationsRouter = Router();

publicationsRouter.get('/', listPublications);
publicationsRouter.post('/', requireAuth, validate(createPublicationSchema), createPublication);
publicationsRouter.put('/:id', requireAuth, validate(updatePublicationSchema), updatePublication);
publicationsRouter.delete('/:id', requireAuth, deletePublication);
