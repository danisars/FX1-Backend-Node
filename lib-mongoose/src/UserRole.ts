import {model, Schema, Document, Types} from 'mongoose';

export interface UserRoleModel {
  createdAt: number;
  updatedAt: number;
  group: string;
  groupType: string;
  groupID: string;
  userID: string;
  uid: string;
  lockerRoomID: string;
  role: string;
  status: string;
  isPrimaryOwner?: boolean | null;
}

const schema = new Schema<UserRoleDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  updatedAt: {type: Number, default: () => new Date().getTime()},
  group: {type: String, required: true},
  groupType: {
    type: String,
    required: true,
    enum: ['Club', 'League', 'FanGroup', 'InHouse', 'Channel'],
  },
  groupID: {type: String, required: true},
  userID: {type: String, required: true},
  uid: {type: String, required: true},
  lockerRoomID: {type: String, required: true},
  role: {type: String, required: true},
  status: {type: String, required: true},
  isPrimaryOwner: {type: Boolean, default: () => false},
});

schema.index({groupType: 1});
schema.index({groupType: 1, role: 1});
schema.index({group: 1});
schema.index({group: 1, role: 1});
schema.index({uid: 1, group: 1, role: 1}, {unique: true});
schema.index({lockerRoomID: 1, groupType: 1});
schema.index({userID: 1, lockerRoomID: 1});
schema.index({uid: 1, lockerRoomID: 1});
schema.index({lockerRoomID: 1, uid: 1});

schema.set('toJSON', {virtuals: true});

export interface UserRoleDocument
  extends Document<Types.ObjectId | string>,
    UserRoleModel {}

export const UserRole = model<UserRoleDocument>('UserRole', schema, 'UserRole');
