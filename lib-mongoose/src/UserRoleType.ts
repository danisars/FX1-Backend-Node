import {model, Schema, Document} from 'mongoose';

export interface UserRoleTypeModel {
  _id: string;
  name: string;
}

const schema = new Schema<UserRoleTypeDocument>({
  _id: {type: String, lowercase: true},
  name: {type: String, required: true, unique: true},
});

schema.set('toJSON', {virtuals: true});

export interface UserRoleTypeDocument
  extends Document<string>,
    UserRoleTypeModel {
  _id: string;
}

export const UserRoleType = model<UserRoleTypeDocument>(
  'UserRoleType',
  schema,
  'UserRoleType'
);
