import { Schema, model, type InferSchemaType } from 'mongoose';
import { PUBLICATION_TYPES } from '@portfolio/shared';
import { toJSONPlugin } from './plugins/toJSON.plugin.js';

const publicationSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    type: { type: String, enum: PUBLICATION_TYPES, required: true },
    venue: { type: String, required: true, trim: true, maxlength: 160 },
    url: { type: String, trim: true },
    date: { type: Date, required: true },
    description: { type: String, trim: true, maxlength: 600 },
    coAuthors: { type: [String], default: [] },
    slidesUrl: { type: String, trim: true },
    coverImage: { type: Schema.Types.ObjectId, ref: 'Media', default: null },
  },
  { timestamps: true },
);

publicationSchema.index({ date: -1 });
publicationSchema.plugin(toJSONPlugin);

export type PublicationDocument = InferSchemaType<typeof publicationSchema>;
export const Publication = model('Publication', publicationSchema);
