import {model, Schema, Document, Types} from 'mongoose';

export interface InHouseMediaModel {
  objectType: string;
  objectID: string;
}

export interface InHouseModel {
  createdAt: number;
  updatedAt: number;
  name: string;
  slug: string;
  sportIDs: string[];
  Avatar?: InHouseMediaModel | null;
  CoverPhoto?: InHouseMediaModel | null;
}

const mediaSchema = new Schema<InHouseMediaDocument>({
  objectType: {type: String, enum: ['Photo', 'Video']},
  objectID: String,
});

const schema = new Schema<InHouseDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  updatedAt: {type: Number, default: () => new Date().getTime()},
  name: {type: String, required: true},
  slug: {type: String, required: true, unique: true},
  sportIDs: {type: [String], default: () => []},
  Avatar: {type: mediaSchema, default: () => null},
  CoverPhoto: {type: mediaSchema, default: () => null},
});

schema.index({sportIDs: 1, name: 1}, {unique: true});
schema.index({slug: 1}, {unique: true});

schema.set('toJSON', {virtuals: true});

export interface InHouseMediaDocument
  extends Document<Types.ObjectId | string>,
    InHouseMediaModel {}

export interface InHouseDocument
  extends Document<Types.ObjectId | string>,
    InHouseModel {}

export const InHouse = model<InHouseDocument>('InHouse', schema, 'InHouse');
