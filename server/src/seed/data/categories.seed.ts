import type { HydratedDocument } from 'mongoose';
import { Category, type CategoryDocument } from '../../models/index.js';
import { slugify } from '../../services/slug.service.js';

const NAMES = [
  { name: 'Music', description: 'Original compositions, releases, and production work.' },
  { name: 'Sound Installation', description: 'Site-specific and gallery sound works.' },
  { name: 'Visual Art', description: 'Painting, mixed media, and visual works.' },
  { name: 'Performance', description: 'Live performance, exhibitions, and collaborative shows.' },
];

export async function seedCategories(): Promise<Record<string, HydratedDocument<CategoryDocument>>> {
  const byKey: Record<string, HydratedDocument<CategoryDocument>> = {};
  for (const { name, description } of NAMES) {
    byKey[name] = await Category.create({
      name,
      slug: slugify(name),
      description,
      appliesTo: 'both',
    });
  }
  return byKey;
}
