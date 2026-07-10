import { Schema, model, type InferSchemaType } from 'mongoose';
import { toJSONPlugin } from './plugins/toJSON.plugin.js';

const tagSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true },
);

tagSchema.plugin(toJSONPlugin);

export type TagDocument = InferSchemaType<typeof tagSchema>;
export const Tag = model('Tag', tagSchema);
