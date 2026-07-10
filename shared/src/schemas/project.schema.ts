import { z } from 'zod';
import { CONTENT_STATUSES } from '../constants/enums.js';
import { objectId, seoMetaSchema, slug } from './common.js';

const linksSchema = z.object({
  repoUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  caseStudyUrl: z.string().url().optional().or(z.literal('')),
});

export const createProjectSchema = z.object({
  title: z.string().min(1).max(160),
  slug: slug.optional(),
  summary: z.string().min(1).max(300),
  descriptionMarkdown: z.string().min(1),
  coverImage: objectId.nullish(),
  gallery: z.array(objectId).default([]),
  techStack: z.array(z.string().min(1).max(40)).default([]),
  role: z.string().max(120).optional(),
  links: linksSchema.default({}),
  category: objectId.nullish(),
  tags: z.array(objectId).default([]),
  status: z.enum(CONTENT_STATUSES).default('draft'),
  featured: z.boolean().default(false),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullish(),
  order: z.number().int().default(0),
  seo: seoMetaSchema.optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const reorderProjectsSchema = z.object({
  items: z.array(z.object({ id: objectId, order: z.number().int() })).min(1),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
