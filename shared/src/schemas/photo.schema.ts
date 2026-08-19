import { z } from 'zod';
import { objectId } from './common.js';

export const updatePhotoSchema = z.object({
  caption: z.string().max(300).optional(),
  order: z.number().int().optional(),
});

export const reorderPhotosSchema = z.object({
  items: z.array(z.object({ id: objectId, order: z.number().int() })).min(1),
});

export type UpdatePhotoInput = z.infer<typeof updatePhotoSchema>;
