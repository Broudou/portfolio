import { z } from 'zod';
import { objectId } from './common.js';

export const reorderPhotosSchema = z.object({
  items: z.array(z.object({ id: objectId, order: z.number().int() })).min(1),
});
