import { Router } from 'express';
import { updatePhotoSchema } from '@portfolio/shared';
import { deletePhoto, updatePhoto } from '../../controllers/photo.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';

export const photosRouter = Router();

photosRouter.patch('/:id', requireAuth, validate(updatePhotoSchema), updatePhoto);
photosRouter.delete('/:id', requireAuth, deletePhoto);
