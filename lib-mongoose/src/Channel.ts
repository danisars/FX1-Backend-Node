import {model, Schema, Document, Types} from 'mongoose';

export interface ChannelModel {
  createdAt: number;
  updatedAt: number;
  name: string;
  slug: string;
  description?: string | null;
  channelGroupID: string;
  type: string;
  isDeleted?: boolean | null;
  lockerRoomID: string;
  livestreamID?: string | null;
}

const schema = new Schema<ChannelDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  updatedAt: {type: Number, default: () => new Date().getTime()},
  name: {type: String, required: true},
  slug: {type: String, required: true, unique: true},
  description: {type: String},
  channelGroupID: {type: String, required: true},
  type: {type: String, required: true},
  isDeleted: {type: Boolean, default: () => false},
  lockerRoomID: {type: String, required: true},
  livestreamID: {type: String, default: () => null},
});

schema.index({channelGroupID: 1});
schema.index({slug: 1}, {unique: true});
schema.index({_id: 1, isDeleted: 1});
schema.index({channelGroupID: 1, isDeleted: 1});
schema.index({lockerRoomID: 1, isDeleted: 1});

schema.set('toJSON', {virtuals: true});

export interface ChannelDocument
  extends Document<Types.ObjectId | string>,
    ChannelModel {}

export const Channel = model<ChannelDocument>('Channel', schema, 'Channel');
