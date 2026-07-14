import type { Model, HydratedDocument } from 'mongoose';

/**
 * Shared helper for singleton collections (Biography, Setting). Both are
 * modeled with a unique, immutable `singletonKey: 'main'` field; this
 * upserts on that key so the document is created lazily on first read/write
 * rather than requiring a bespoke "create" route.
 */
export async function getOrCreateSingleton<T extends { singletonKey: string }>(
  model: Model<T>,
  defaults: Partial<T>,
  populate?: string | string[],
): Promise<HydratedDocument<T>> {
  const query = model.findOneAndUpdate(
    { singletonKey: 'main' },
    { $setOnInsert: { singletonKey: 'main', ...defaults } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  const doc = populate ? await query.populate(populate) : await query;
  return doc as HydratedDocument<T>;
}

export async function updateSingleton<T extends { singletonKey: string }>(
  model: Model<T>,
  patch: Partial<T>,
  populate?: string | string[],
): Promise<HydratedDocument<T>> {
  const query = model.findOneAndUpdate({ singletonKey: 'main' }, patch, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });
  const doc = populate ? await query.populate(populate) : await query;
  return doc as HydratedDocument<T>;
}
