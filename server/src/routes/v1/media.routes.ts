import { Router } from 'express';
import { updateMediaSchema } from '@portfolio/shared';
import {
  deleteMedia,
  listMedia,
  updateMedia,
  uploadMedia,
} from '../../controllers/media.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { uploadSingleImage } from '../../middleware/upload.middleware.js';

export const mediaRouter = Router();

mediaRouter.get('/', requireAuth, listMedia);
mediaRouter.post('/', requireAuth, uploadSingleImage, uploadMedia);
mediaRouter.put('/:id', requireAuth, validate(updateMediaSchema), updateMedia);
mediaRouter.delete('/:id', requireAuth, deleteMedia);
