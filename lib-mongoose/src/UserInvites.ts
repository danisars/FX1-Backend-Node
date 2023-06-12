import {model, Schema, Document, Types} from 'mongoose';
const {Mixed} = Schema.Types;

export interface UserInvitesModel {
  time: number;
  type: string;
  userID: string;
  group: string;
  url?: string | null; // to be removed once SendGrid is ready
  data: any;
  expiration: number;
}

const schema = new Schema({
  time: {type: Number, default: () => new Date().getTime()},
  type: {type: String, enum: ['InviteUserInLockerRoomForManagerialRole', 'InviteToPrivateChannel']},
  userID: {type: String, required: true},
  group: {type: String, required: true},
  url: {type: String},
  data: Mixed,
  expiration: {type: Number},
});
schema.index({type: 1});
schema.index({userID: 1});
schema.set('toJSON', {virtuals: true});

export interface UserInvitesDocument
  extends Document<Types.ObjectId | string>,
    UserInvitesModel {}

export const UserInvites = model<UserInvitesDocument>(
  'UserInvites',
  schema,
  'UserInvites'
);
