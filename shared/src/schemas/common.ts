import { z } from 'zod';

/** Matches a Mongo ObjectId (24 hex chars). Used to validate ref fields. */
export const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Must be a valid id');

/** URL-safe slug: lowercase letters, numbers, hyphens. */
export const slug = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Must be a lowercase, hyphen-separated slug');

export const seoMetaSchema = z.object({
  title: z.string().max(70).optional(),
  description: z.string().max(160).optional(),
  ogImage: objectId.nullish(),
});
