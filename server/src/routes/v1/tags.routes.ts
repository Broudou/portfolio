import { Router } from 'express';
import { createTagSchema, updateTagSchema } from '@portfolio/shared';
import { createTag, deleteTag, listTags, updateTag } from '../../controllers/tag.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';

export const tagsRouter = Router();

tagsRouter.get('/', listTags);
tagsRouter.post('/', requireAuth, validate(createTagSchema), createTag);
tagsRouter.put('/:id', requireAuth, validate(updateTagSchema), updateTag);
tagsRouter.delete('/:id', requireAuth, deleteTag);
