import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { biographyRouter } from './biography.routes.js';
import { projectsRouter } from './projects.routes.js';
import { articlesRouter } from './articles.routes.js';
import { categoriesRouter } from './categories.routes.js';
import { tagsRouter } from './tags.routes.js';
import { mediaRouter } from './media.routes.js';
import { navigationRouter } from './navigation.routes.js';
import { timelineRouter } from './timeline.routes.js';
import { publicationsRouter } from './publications.routes.js';
import { settingsRouter } from './settings.routes.js';
import { contactRouter } from './contact.routes.js';

export const v1Router = Router();

v1Router.use('/auth', authRouter);
v1Router.use('/biography', biographyRouter);
v1Router.use('/projects', projectsRouter);
v1Router.use('/articles', articlesRouter);
v1Router.use('/categories', categoriesRouter);
v1Router.use('/tags', tagsRouter);
v1Router.use('/media', mediaRouter);
v1Router.use('/navigation', navigationRouter);
v1Router.use('/timeline', timelineRouter);
v1Router.use('/publications', publicationsRouter);
v1Router.use('/settings', settingsRouter);
v1Router.use('/contact', contactRouter);
