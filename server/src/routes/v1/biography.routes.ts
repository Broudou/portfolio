import { Router } from 'express';
import { updateBiographySchema } from '@portfolio/shared';
import { getBiography, updateBiography } from '../../controllers/biography.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';

export const biographyRouter = Router();

biographyRouter.get('/', getBiography);
biographyRouter.put('/', requireAuth, validate(updateBiographySchema), updateBiography);
