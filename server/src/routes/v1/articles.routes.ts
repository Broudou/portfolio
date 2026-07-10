import { Router } from 'express';
import { createArticleSchema, updateArticleSchema } from '@portfolio/shared';
import {
  createArticle,
  deleteArticle,
  getArticleBySlug,
  listArticles,
  updateArticle,
} from '../../controllers/article.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';

export const articlesRouter = Router();

articlesRouter.get('/', listArticles);
articlesRouter.get('/:slug', getArticleBySlug);
articlesRouter.post('/', requireAuth, validate(createArticleSchema), createArticle);
articlesRouter.put('/:id', requireAuth, validate(updateArticleSchema), updateArticle);
articlesRouter.delete('/:id', requireAuth, deleteArticle);
