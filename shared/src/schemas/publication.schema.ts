import { z } from 'zod';
import { PUBLICATION_TYPES } from '../constants/enums.js';
import { objectId } from './common.js';

export const createPublicationSchema = z.object({
  title: z.string().min(1).max(200),
  type: z.enum(PUBLICATION_TYPES),
  venue: z.string().min(1).max(160),
  url: z.string().url().optional().or(z.literal('')),
  date: z.coerce.date(),
  description: z.string().max(600).optional(),
  coAuthors: z.array(z.string().min(1).max(120)).default([]),
  slidesUrl: z.string().url().optional().or(z.literal('')),
  coverImage: objectId.nullish(),
});

export const updatePublicationSchema = createPublicationSchema.partial();

export type CreatePublicationInput = z.infer<typeof createPublicationSchema>;
export type UpdatePublicationInput = z.infer<typeof updatePublicationSchema>;
