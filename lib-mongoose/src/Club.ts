import {model, Schema, Document, Types} from 'mongoose';

export interface ClubMediaModel {
  objectType: string;
  objectID: string;
}

export interface ClubModel {
  createdAt: number;
  updatedAt: number;
  name: string;
  slug: string;
  sportIDs: string[];
  Avatar?: ClubMediaModel | null;
  CoverPhoto?: ClubMediaModel | null;
  leagueID?: string | null;
  isFeatured?: boolean | null;
}

const mediaSchema = new Schema<ClubMediaDocument>({
  objectType: {type: String, enum: ['Photo', 'Video']},
  objectID: String,
});

const schema = new Schema<ClubDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  updatedAt: {type: Number, default: () => new Date().getTime()},
  name: {type: String, required: true},
  slug: {type: String, required: true, unique: true},
  sportIDs: {type: [String], default: () => []},
  Avatar: {type: mediaSchema, default: () => null},
  CoverPhoto: {type: mediaSchema, default: () => null},
  leagueID: {type: String, default: () => null},
  isFeatured: {type: Boolean, default: () => false},
});

schema.index({sportIDs: 1, leagueID: 1, name: 1}, {unique: true});
schema.index({slug: 1}, {unique: true});
schema.index({leagueID: 1});

schema.set('toJSON', {virtuals: true});

export interface ClubMediaDocument
  extends Document<Types.ObjectId | string>,
    ClubMediaModel {}

export interface ClubDocument
  extends Document<Types.ObjectId | string>,
    ClubModel {}

export const Club = model<ClubDocument>('Club', schema, 'Club');
