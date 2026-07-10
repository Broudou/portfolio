import type { Request, Response } from 'express';
import type { CreateProjectInput, UpdateProjectInput } from '@portfolio/shared';
import { Project } from '../models/index.js';
import { generateUniqueSlug } from '../services/slug.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { buildPaginationMeta, sendPaginated, sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const POPULATE = ['category', 'tags', 'coverImage', 'gallery', 'seo.ogImage'];

export const listProjects = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));
  const filter: Record<string, unknown> = {};

  // Anonymous callers only ever see published projects. An authenticated
  // admin/editor sees every status by default, or a specific one via ?status=.
  if (req.user) {
    if (req.query.status) filter.status = req.query.status;
  } else {
    filter.status = 'published';
  }
  if (req.query.category) filter.category = req.query.category;
  if (req.query.tag) filter.tags = req.query.tag;
  if (req.query.q) filter.$text = { $search: String(req.query.q) };

  const [items, total] = await Promise.all([
    Project.find(filter)
      .sort({ order: 1, startDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(POPULATE),
    Project.countDocuments(filter),
  ]);

  sendPaginated(res, items, buildPaginationMeta(total, page, limit));
});

export const getProjectBySlug = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findOne({ slug: req.params.slug }).populate(POPULATE);
  if (!project) throw ApiError.notFound('Project');
  if (project.status !== 'published' && !req.user) throw ApiError.notFound('Project');
  sendSuccess(res, project);
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateProjectInput;
  const slug = input.slug ?? (await generateUniqueSlug(Project, input.title));
  const project = await Project.create({ ...input, slug });
  sendSuccess(res, project, 201);
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as UpdateProjectInput;
  const project = await Project.findByIdAndUpdate(req.params.id, input, {
    new: true,
    runValidators: true,
  }).populate(POPULATE);
  if (!project) throw ApiError.notFound('Project');
  sendSuccess(res, project);
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) throw ApiError.notFound('Project');
  sendSuccess(res, { deleted: true });
});

export const reorderProjects = asyncHandler(async (req: Request, res: Response) => {
  const { items } = req.body as { items: { id: string; order: number }[] };
  await Promise.all(
    items.map(({ id, order }) => Project.updateOne({ _id: id }, { $set: { order } })),
  );
  sendSuccess(res, { reordered: items.length });
});
