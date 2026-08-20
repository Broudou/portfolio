import { Router } from 'express';
import { deletePhoto } from '../../controllers/photo.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

export const photosRouter = Router();

photosRouter.delete('/:id', requireAuth, deletePhoto);
