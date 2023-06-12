import {model, Schema, Document, Types} from 'mongoose';

export interface SystemChannelGroupModel {
  createdAt: number;
  updatedAt: number;
  name: string;
  slug: string;
  description?: string | null;
  systemLockerRoomID: string;
  isDeleted?: boolean | null;
}

const schema = new Schema<SystemChannelGroupDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  updatedAt: {type: Number, default: () => new Date().getTime()},
  name: {type: String, required: true},
  slug: {type: String, required: true, unique: true},
  description: {type: String},
  systemLockerRoomID: {type: String, required: true},
  isDeleted: {type: Boolean, default: () => false},
});

schema.index({slug: 1}, {unique: true});

schema.set('toJSON', {virtuals: true});

export interface SystemChannelGroupDocument
  extends Document<Types.ObjectId | string>,
    SystemChannelGroupModel {}

export const SystemChannelGroup = model<SystemChannelGroupDocument>(
  'SystemChannelGroup',
  schema,
  'SystemChannelGroup'
);
