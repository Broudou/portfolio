import { Schema, model, type InferSchemaType } from 'mongoose';
import { toJSONPlugin } from './plugins/toJSON.plugin.js';

const photoSchema = new Schema(
  {
    album: { type: Schema.Types.ObjectId, ref: 'Album', required: true },
    image: { type: Schema.Types.ObjectId, ref: 'Media', required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

photoSchema.index({ album: 1, order: 1 });

photoSchema.plugin(toJSONPlugin);

export type PhotoDocument = InferSchemaType<typeof photoSchema>;
export const Photo = model('Photo', photoSchema);
