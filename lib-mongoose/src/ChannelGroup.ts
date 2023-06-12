import {model, Schema, Document, Types} from 'mongoose';

export interface ChannelGroupModel {
  createdAt: number;
  updatedAt: number;
  name: string;
  slug: string;
  description?: string | null;
  group: string;
  lockerRoomID: string;
  isDeleted?: boolean | null;
  withLivestream?: boolean | null;
}

const schema = new Schema<ChannelGroupDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  updatedAt: {type: Number, default: () => new Date().getTime()},
  name: {type: String, required: true},
  slug: {type: String, required: true, unique: true},
  description: {type: String},
  group: {type: String, required: true},
  lockerRoomID: {type: String, required: true},
  isDeleted: {type: Boolean, default: () => false},
  withLivestream: {type: Boolean, default: () => false},
});

schema.index({lockerRoomID: 1});
schema.index({slug: 1}, {unique: true});
schema.index({_id: 1, isDeleted: 1});
schema.index({lockerRoomID: 1, isDeleted: 1});
schema.index({lockerRoomID: 1, withLivestream: 1});

schema.set('toJSON', {virtuals: true});

export interface ChannelGroupDocument
  extends Document<Types.ObjectId | string>,
    ChannelGroupModel {}

export const ChannelGroup = model<ChannelGroupDocument>(
  'ChannelGroup',
  schema,
  'ChannelGroup'
);
