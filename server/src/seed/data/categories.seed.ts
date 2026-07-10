import type { HydratedDocument } from 'mongoose';
import { Category, type CategoryDocument } from '../../models/index.js';
import { slugify } from '../../services/slug.service.js';

const NAMES = [
  { name: 'Backend', description: 'APIs, services, and server-side systems.' },
  { name: 'Frontend', description: 'User interfaces and client-side engineering.' },
  { name: 'DevOps', description: 'Infrastructure, CI/CD, and operations.' },
  { name: 'Architecture', description: 'System design and long-term technical decisions.' },
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
