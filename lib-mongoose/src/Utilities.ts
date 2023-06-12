import {model, Schema, Document, Types} from 'mongoose';
const {Mixed} = Schema.Types;

export interface UtilitiesModel {
  createdAt: number;
  updatedAt: number;
  key: string;
  value: any;
}

const schema = new Schema<UtilitiesDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  updatedAt: {type: Number, default: () => new Date().getTime()},
  key: {type: String, required: true, unique: true},
  value: {type: Mixed, required: true},
});

schema.index({key: 1});

schema.set('toJSON', {virtuals: true});

export interface UtilitiesDocument
  extends Document<Types.ObjectId | string>,
    UtilitiesModel {}

export const Utilities = model<UtilitiesDocument>(
  'Utilities',
  schema,
  'Utilities'
);
