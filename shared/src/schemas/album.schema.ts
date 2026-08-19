import { z } from 'zod';
import { CONTENT_STATUSES } from '../constants/enums.js';
import { objectId, seoMetaSchema, slug } from './common.js';

export const createAlbumSchema = z.object({
  title: z.string().min(1).max(160),
  slug: slug.optional(),
  description: z.string().max(600).optional(),
  cover: objectId.nullish(),
  status: z.enum(CONTENT_STATUSES).default('draft'),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  seo: seoMetaSchema.optional(),
});

export const updateAlbumSchema = createAlbumSchema.partial();

export const reorderAlbumsSchema = z.object({
  items: z.array(z.object({ id: objectId, order: z.number().int() })).min(1),
});

export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;
export type UpdateAlbumInput = z.infer<typeof updateAlbumSchema>;
