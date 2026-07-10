import { z } from 'zod';
import { objectId } from './common.js';

export const createNavigationItemSchema = z.object({
  label: z.string().min(1).max(60),
  path: z.string().min(1).max(200),
  order: z.number().int().default(0),
  isExternal: z.boolean().default(false),
  isVisible: z.boolean().default(true),
  openInNewTab: z.boolean().default(false),
});

export const updateNavigationItemSchema = createNavigationItemSchema.partial();

export const reorderNavigationSchema = z.object({
  items: z.array(z.object({ id: objectId, order: z.number().int() })).min(1),
});

export type CreateNavigationItemInput = z.infer<typeof createNavigationItemSchema>;
export type UpdateNavigationItemInput = z.infer<typeof updateNavigationItemSchema>;
