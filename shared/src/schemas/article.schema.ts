import { z } from 'zod';
import { CONTENT_STATUSES } from '../constants/enums.js';
import { objectId, seoMetaSchema, slug } from './common.js';

export const createArticleSchema = z.object({
  title: z.string().min(1).max(200),
  slug: slug.optional(),
  excerpt: z.string().min(1).max(300),
  contentMarkdown: z.string().min(1),
  coverImage: objectId.nullish(),
  category: objectId.nullish(),
  tags: z.array(objectId).default([]),
  status: z.enum(CONTENT_STATUSES).default('draft'),
  publishedAt: z.coerce.date().nullish(),
  featured: z.boolean().default(false),
  seo: seoMetaSchema.optional(),
});

export const updateArticleSchema = createArticleSchema.partial();

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
