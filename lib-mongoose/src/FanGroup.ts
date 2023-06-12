import {model, Schema, Document, Types} from 'mongoose';

export interface FanGroupMediaModel {
  objectType: string;
  objectID: string;
}

export interface FanGroupModel {
  createdAt: number;
  updatedAt: number;
  name: string;
  slug: string;
  sportIDs: string[];
  Avatar?: FanGroupMediaModel | null;
  CoverPhoto?: FanGroupMediaModel | null;
  isFeatured?: boolean | null;
  isDeleted?: boolean | null;
}

const mediaSchema = new Schema<FanGroupMediaDocument>({
  objectType: {type: String, enum: ['Photo', 'Video']},
  objectID: String,
});

const schema = new Schema<FanGroupDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  updatedAt: {type: Number, default: () => new Date().getTime()},
  name: {type: String, required: true},
  slug: {type: String, required: true, unique: true},
  sportIDs: {type: [String], default: () => []},
  Avatar: {type: mediaSchema, default: () => null},
  CoverPhoto: {type: mediaSchema, default: () => null},
  isFeatured: {type: Boolean, default: () => false},
  isDeleted: {type: Boolean, default: () => false},
});

schema.index({sportIDs: 1, name: 1}, {unique: true});
schema.index({slug: 1}, {unique: true});

schema.set('toJSON', {virtuals: true});

export interface FanGroupMediaDocument
  extends Document<Types.ObjectId | string>,
    FanGroupMediaModel {}

export interface FanGroupDocument
  extends Document<Types.ObjectId | string>,
    FanGroupModel {}

export const FanGroup = model<FanGroupDocument>('FanGroup', schema, 'FanGroup');
