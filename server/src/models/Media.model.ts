import { Schema, model, type InferSchemaType } from 'mongoose';
import { toJSONPlugin } from './plugins/toJSON.plugin.js';

const mediaSchema = new Schema(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    altText: { type: String, required: true, trim: true, maxlength: 200 },
    width: { type: Number },
    height: { type: Number },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

mediaSchema.index({ createdAt: -1 });
mediaSchema.plugin(toJSONPlugin);

export type MediaDocument = InferSchemaType<typeof mediaSchema>;
export const Media = model('Media', mediaSchema);
