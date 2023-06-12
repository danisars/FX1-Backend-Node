import {model, Schema, Document, Types} from 'mongoose';

export interface ProfileActionModel {
  time: number;
  action: string;
  actorUserID: string;
  targetUserID: string;
}

const schema = new Schema<ProfileActionDocument>({
  time: {type: Number, default: () => new Date().getTime()},
  action: String,
  actorUserID: String,
  targetUserID: String,
});

schema.index({action: 1, actorUserID: 1, targetUserID: 1}, {unique: true});
schema.set('toJSON', {virtuals: true});

export interface ProfileActionDocument
  extends Document<Types.ObjectId | string>,
    ProfileActionModel {}

export const ProfileAction = model<ProfileActionDocument>(
  'ProfileAction',
  schema,
  'ProfileAction'
);
