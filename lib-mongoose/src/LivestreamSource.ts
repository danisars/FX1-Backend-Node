import {model, Schema, Document} from 'mongoose';

export interface LivestreamSourceModel {
  _id: string;
  name: string;
}

const schema = new Schema<LivestreamSourceDocument>({
  _id: {type: String, lowercase: true},
  name: {type: String, required: true, unique: true},
});

schema.set('toJSON', {virtuals: true});

export interface LivestreamSourceDocument
  extends Document<string>,
    LivestreamSourceModel {
  _id: string;
}

export const LivestreamSource = model<LivestreamSourceDocument>(
  'LivestreamSource',
  schema,
  'LivestreamSource'
);
