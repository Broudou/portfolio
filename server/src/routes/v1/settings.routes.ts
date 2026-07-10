import { Router } from 'express';
import { updateSettingSchema } from '@portfolio/shared';
import { getSettings, updateSettings } from '../../controllers/setting.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';

export const settingsRouter = Router();

settingsRouter.get('/', getSettings);
settingsRouter.put('/', requireAuth, validate(updateSettingSchema), updateSettings);
