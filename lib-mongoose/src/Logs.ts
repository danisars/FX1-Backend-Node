import {model, Schema, Document, Types} from 'mongoose';
const {Mixed} = Schema.Types;

export interface LogsModel {
  time: number;
  type: string;
  logs: any;
}

const schema = new Schema({
  time: {type: Date, default: () => new Date()},
  type: String,
  logs: Mixed,
});

schema.index({type: 1});
schema.set('toJSON', {virtuals: true});

export interface LogsDocument
  extends Document<Types.ObjectId | string>,
    LogsModel {}

export const Logs = model<LogsDocument>('Logs', schema, 'Logs');
