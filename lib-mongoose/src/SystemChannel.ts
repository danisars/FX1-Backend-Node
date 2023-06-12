import {model, Schema, Document, Types} from 'mongoose';

export interface SystemChannelModel {
  createdAt: number;
  updatedAt: number;
  name: string;
  slug: string;
  description?: string | null;
  systemChannelGroupID: string;
  type: string;
  isDeleted?: boolean | null;
  systemLockerRoomID: string;
  livestreamID?: string | null;
}

const schema = new Schema<SystemChannelDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  updatedAt: {type: Number, default: () => new Date().getTime()},
  name: {type: String, required: true},
  slug: {type: String, required: true, unique: true},
  description: {type: String},
  systemChannelGroupID: {type: String, required: true},
  type: {type: String, required: true},
  isDeleted: {type: Boolean, default: () => false},
  systemLockerRoomID: {type: String, required: true},
  livestreamID: {type: String, default: () => null},
});

schema.index({systemChannelGroupID: 1});
schema.index({slug: 1}, {unique: true});
schema.index({_id: 1, isDeleted: 1});
schema.index({systemChannelGroupID: 1, isDeleted: 1});
schema.index({systemLockerRoomID: 1, isDeleted: 1});

schema.set('toJSON', {virtuals: true});

export interface SystemChannelDocument
  extends Document<Types.ObjectId | string>,
    SystemChannelModel {}

export const SystemChannel = model<SystemChannelDocument>(
  'SystemChannel',
  schema,
  'SystemChannel'
);
