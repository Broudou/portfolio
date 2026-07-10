import type { Schema } from 'mongoose';

/**
 * Normalizes every document's JSON output to the shared `BaseEntity` wire
 * shape: `_id` -> `id` (string), drop `__v`, and recursively apply the same
 * transform to populated sub-documents so nested refs also come back as
 * `{ id, ... }` rather than `{ _id, ... }`.
 */
export function toJSONPlugin(schema: Schema): void {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.id = String(ret._id);
      delete ret._id;
      delete ret.passwordHash;
      return ret;
    },
  });
}
