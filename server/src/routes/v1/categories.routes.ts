import { Router } from 'express';
import { createCategorySchema, updateCategorySchema } from '@portfolio/shared';
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from '../../controllers/category.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';

export const categoriesRouter = Router();

categoriesRouter.get('/', listCategories);
categoriesRouter.post('/', requireAuth, validate(createCategorySchema), createCategory);
categoriesRouter.put('/:id', requireAuth, validate(updateCategorySchema), updateCategory);
categoriesRouter.delete('/:id', requireAuth, deleteCategory);
