import { z } from 'zod';
import { backgroundMediaSchema, objectId, seoMetaSchema } from './common.js';

export const updateBiographySchema = z.object({
  fullName: z.string().min(1).max(120),
  headline: z.string().min(1).max(200),
  summary: z.string().min(1).max(400),
  bioMarkdown: z.string().min(1),
  avatar: objectId.nullish(),
  location: z.string().max(120).optional(),
  skills: z.array(z.string().min(1).max(60)).default([]),
  highlights: z.array(z.string().min(1).max(200)).default([]),
  background: backgroundMediaSchema.default({ type: 'none', media: null }),
  seo: seoMetaSchema.optional(),
});

export type UpdateBiographyInput = z.infer<typeof updateBiographySchema>;
