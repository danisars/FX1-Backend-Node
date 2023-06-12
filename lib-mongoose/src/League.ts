import {model, Schema, Document, Types} from 'mongoose';

export interface LeagueMediaModel {
  objectType: string;
  objectID: string;
}

export interface LeagueModel {
  createdAt: number;
  updatedAt: number;
  name: string;
  slug: string;
  sportIDs: string[];
  Avatar?: LeagueMediaModel | null;
  CoverPhoto?: LeagueMediaModel | null;
  isFeatured?: boolean | null;
  boost: number;
}

const mediaSchema = new Schema<LeagueMediaDocument>({
  objectType: {type: String, enum: ['Photo', 'Video']},
  objectID: String,
});

const schema = new Schema<LeagueDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  updatedAt: {type: Number, default: () => new Date().getTime()},
  name: {type: String, required: true},
  slug: {type: String, required: true, unique: true},
  sportIDs: {type: [String], default: () => []},
  Avatar: {type: mediaSchema, default: () => null},
  CoverPhoto: {type: mediaSchema, default: () => null},
  isFeatured: {type: Boolean, default: () => false},
  boost: {type: Number, default: () => 0},
});

schema.index({sportIDs: 1, name: 1}, {unique: true});
schema.index({slug: 1}, {unique: true});

schema.set('toJSON', {virtuals: true});

export interface LeagueMediaDocument
  extends Document<Types.ObjectId | string>,
    LeagueMediaModel {}

export interface LeagueDocument
  extends Document<Types.ObjectId | string>,
    LeagueModel {}

export const League = model<LeagueDocument>('League', schema, 'League');
