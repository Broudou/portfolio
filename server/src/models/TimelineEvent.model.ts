import { Schema, model, type InferSchemaType } from 'mongoose';
import { TIMELINE_EVENT_TYPES } from '@portfolio/shared';
import { toJSONPlugin } from './plugins/toJSON.plugin.js';

const timelineEventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, required: true, trim: true, maxlength: 600 },
    date: { type: Date, required: true },
    endDate: { type: Date, default: null },
    type: { type: String, enum: TIMELINE_EVENT_TYPES, required: true },
    link: { type: String, trim: true },
  },
  { timestamps: true },
);

timelineEventSchema.index({ date: 1 });
timelineEventSchema.plugin(toJSONPlugin);

export type TimelineEventDocument = InferSchemaType<typeof timelineEventSchema>;
export const TimelineEvent = model('TimelineEvent', timelineEventSchema);
