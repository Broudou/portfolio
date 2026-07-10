import type { Model } from 'mongoose';

const COMBINING_DIACRITICS = /[̀-ͯ]/g;

export function slugify(input: string): string {
  return input
    .toString()
    .normalize('NFKD')
    .replace(COMBINING_DIACRITICS, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates a slug from `source` and appends `-2`, `-3`, ... until it's
 * unique within `model`. Pass `excludeId` when updating an existing
 * document so it doesn't collide with itself.
 */
export async function generateUniqueSlug(
  model: Model<{ slug: string }>,
  source: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(source);
  let candidate = base;
  let suffix = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await model
      .findOne({ slug: candidate, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })
      .lean();
    if (!existing) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}
