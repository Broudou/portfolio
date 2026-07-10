import { z } from 'zod';
import { CATEGORY_APPLIES_TO } from '../constants/enums.js';
import { slug } from './common.js';

export const createCategorySchema = z.object({
  name: z.string().min(1).max(80),
  slug: slug.optional(),
  description: z.string().max(300).optional(),
  appliesTo: z.enum(CATEGORY_APPLIES_TO).default('both'),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
