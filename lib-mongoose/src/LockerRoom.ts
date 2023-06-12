import {model, Schema, Document, Types} from 'mongoose';

export interface LockerRoomModel {
  createdAt: number;
  updatedAt: number;
  name: string;
  slug: string;
  group: string;
}

const schema = new Schema<LockerRoomDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  updatedAt: {type: Number, default: () => new Date().getTime()},
  name: {type: String, required: true},
  slug: {type: String, required: true, unique: true},
  group: {type: String, required: true},
});

schema.index({group: 1}, {unique: true});
schema.index({slug: 1}, {unique: true});

schema.set('toJSON', {virtuals: true});

export interface LockerRoomDocument
  extends Document<Types.ObjectId | string>,
    LockerRoomModel {}

export const LockerRoom = model<LockerRoomDocument>(
  'LockerRoom',
  schema,
  'LockerRoom'
);
