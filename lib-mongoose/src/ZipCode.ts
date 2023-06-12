import {model, Schema, Document, Types} from 'mongoose';

export interface ZipCodeModel {
  zip: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
}

const schema = new Schema<ZipCodeDocument>({
  zip: {type: String, required: true, unique: true},
  latitude: {type: Number, default: () => 0},
  longitude: {type: Number, default: () => 0},
  city: {type: String, required: true},
  state: {type: String, required: true},
  country: {type: String, required: true},
});

schema.set('toJSON', {virtuals: true});

export interface ZipCodeDocument
  extends Document<Types.ObjectId | string>,
    ZipCodeModel {}

export const ZipCode = model<ZipCodeDocument>(
  'ZipCode',
  schema,
  'ZipCode'
);
