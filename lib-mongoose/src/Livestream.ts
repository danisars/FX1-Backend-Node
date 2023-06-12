import {model, Schema, Document, Types} from 'mongoose';

export interface LivestreamModel {
  createdAt: number;
  updatedAt: number;
  title: string;
  link: string;
  source: string;
  startDate?: string | null;
  timezone?: string | null;
  isLive?: boolean | null;
}

const schema = new Schema<LivestreamDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  updatedAt: {type: Number, default: () => new Date().getTime()},
  title: {type: String, required: true},
  link: {type: String, required: true},
  source: {type: String, required: true},
  startDate: {type: String},
  timezone: {type: String},
  isLive: {type: Boolean, default: () => false},
});

schema.set('toJSON', {virtuals: true});

export interface LivestreamDocument
  extends Document<Types.ObjectId | string>,
    LivestreamModel {}

export const Livestream = model<LivestreamDocument>(
  'Livestream',
  schema,
  'Livestream'
);
