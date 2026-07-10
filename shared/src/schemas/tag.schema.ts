import { z } from 'zod';
import { slug } from './common.js';

export const createTagSchema = z.object({
  name: z.string().min(1).max(60),
  slug: slug.optional(),
});

export const updateTagSchema = createTagSchema.partial();

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
