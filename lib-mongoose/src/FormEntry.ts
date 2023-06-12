import {model, Schema, Document, Types} from 'mongoose';
const {Mixed} = Schema.Types;

export interface FormEntryModel {
  time: number;
  type: string;
  actor?: string | null;
  userID?: string | null;
  data: any;
}

const schema = new Schema({
  time: {type: Date, default: () => new Date()},
  type: String,
  actor: String,
  userID: String,
  data: Mixed,
});
schema.index({type: 1});
schema.index({actor: 1});
schema.index({userID: 1});
schema.set('toJSON', {virtuals: true});

export interface FormEntryDocument
  extends Document<Types.ObjectId | string>,
    FormEntryModel {}

export const FormEntry = model<FormEntryDocument>(
  'FormEntry',
  schema,
  'FormEntry'
);
