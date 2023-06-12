import {model, Schema, Document, Types} from 'mongoose';

export interface SportMediaModel {
  objectType: string;
  objectID: string;
  isSport?: boolean | null;
}

export interface SportModel {
  createdAt: number;
  updatedAt: number;
  name: string;
  slug: string;
  Avatar: SportMediaModel;
  CoverPhoto: SportMediaModel;
  Icon: SportMediaModel | null;
  status: string;
  isHidden?: boolean | null;
}

const mediaSchema = new Schema<SportMediaDocument>({
  objectType: {type: String, enum: ['Photo', 'Video']},
  objectID: String,
  isSport: {type: Boolean, default: () => true},
});

const schema = new Schema<SportDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  updatedAt: {type: Number, default: () => new Date().getTime()},
  name: {type: String, required: true, unique: true},
  slug: {
    type: String,
    required: true,
    unique: true,
    enum: [
      'afl',
      'american-football',
      'baseball',
      'basketball',
      'boxing',
      'cricket',
      'football',
      'in-house',
      'mma',
      'nrl',
      'rugby',
      'soccer',
      'sport',
      'tennis',
      'triathlon'
    ],
  },
  Avatar: {type: mediaSchema},
  CoverPhoto: {type: mediaSchema},
  Icon: {type: mediaSchema, default: () => null},
  status: {type: String, default: () => 'Coming Soon'},
  isHidden: {type: Boolean, default: () => false},
});

schema.index({name: 1}, {unique: true});
schema.index({slug: 1}, {unique: true});
schema.index({isHidden: 1});

schema.set('toJSON', {virtuals: true});

export interface SportMediaDocument
  extends Document<Types.ObjectId | string>,
    SportMediaModel {}

export interface SportDocument
  extends Document<Types.ObjectId | string>,
    SportModel {}

export const Sport = model<SportDocument>('Sport', schema, 'Sport');
