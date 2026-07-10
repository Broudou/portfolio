import type { HydratedDocument } from 'mongoose';
import { Tag, type TagDocument } from '../../models/index.js';
import { slugify } from '../../services/slug.service.js';

const NAMES = [
  'TypeScript',
  'Node.js',
  'MongoDB',
  'SvelteKit',
  'Docker',
  'Kubernetes',
  'Testing',
  'Performance',
  'Accessibility',
  'System Design',
];

export async function seedTags(): Promise<Record<string, HydratedDocument<TagDocument>>> {
  const byKey: Record<string, HydratedDocument<TagDocument>> = {};
  for (const name of NAMES) {
    byKey[name] = await Tag.create({ name, slug: slugify(name) });
  }
  return byKey;
}
