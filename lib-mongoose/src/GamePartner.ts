import {model, Schema, Document, Types} from 'mongoose';

export interface GamePartnerMediaModel {
  objectType: string;
  objectID: string;
  isSport?: boolean | null;
}

export interface GamePartnerModel {
  name: string;
  slug: string;
  Icon?: GamePartnerMediaModel | null;
  Logo?: GamePartnerMediaModel | null;
  isHidden?: boolean;
}

const mediaSchema = new Schema<GamePartnerMediaDocument>({
  objectType: {type: String, enum: ['Photo', 'Video']},
  objectID: String,
  isSport: {type: Boolean, default: () => true},
});

const schema = new Schema<GamePartnerDocument>({
  name: {type: String, required: true},
  slug: {type: String, required: true, unique: true},
  Icon: {type: mediaSchema, default: () => null},
  Logo: {type: mediaSchema, default: () => null},
  isHidden: {type: Boolean, default: () => false},
});

schema.index({slug: 1}, {unique: true});

schema.set('toJSON', {virtuals: true});

export interface GamePartnerMediaDocument
  extends Document<Types.ObjectId | string>,
    GamePartnerMediaModel {}

export interface GamePartnerDocument
  extends Document<Types.ObjectId | string>,
    GamePartnerModel {}

export const GamePartner = model<GamePartnerDocument>('GamePartner', schema, 'GamePartner');
