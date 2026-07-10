import { Router } from 'express';
import { createProjectSchema, reorderProjectsSchema, updateProjectSchema } from '@portfolio/shared';
import {
  createProject,
  deleteProject,
  getProjectBySlug,
  listProjects,
  reorderProjects,
  updateProject,
} from '../../controllers/project.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';

export const projectsRouter = Router();

projectsRouter.get('/', listProjects);
projectsRouter.patch(
  '/reorder',
  requireAuth,
  validate(reorderProjectsSchema),
  reorderProjects,
);
projectsRouter.get('/:slug', getProjectBySlug);
projectsRouter.post('/', requireAuth, validate(createProjectSchema), createProject);
projectsRouter.put('/:id', requireAuth, validate(updateProjectSchema), updateProject);
projectsRouter.delete('/:id', requireAuth, deleteProject);
