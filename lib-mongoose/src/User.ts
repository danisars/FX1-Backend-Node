import {model, Schema, Document, Types} from 'mongoose';

export interface UserMediaModel {
  objectType: string;
  objectID: string;
}

export interface UserModel {
  createdAt: number;
  updatedAt: number;
  username: string;
  slug: string;
  uid: string;
  firstName?: string | null;
  lastName?: string | null;
  emailAddress: string;
  Avatar: UserMediaModel | null;
  online?: boolean | null;
  isActive?: boolean | null;
  zipCode?: string | null;
  // virtuals
  // name?: string | null;
}

const mediaSchema = new Schema<UserMediaDocument>({
  objectType: {type: String, enum: ['Photo', 'Video']},
  objectID: String,
});

const schema = new Schema<UserDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  updatedAt: {type: Number, default: () => new Date().getTime()},
  username: {type: String, required: true, unique: true},
  slug: {type: String, required: true, unique: true},
  uid: {type: String, required: true, unique: true},
  firstName: {type: String, default: () => null},
  lastName: {type: String, default: () => null},
  emailAddress: {type: String, required: true},
  Avatar: {type: mediaSchema, default: () => null},
  online: {type: Boolean, required: true, default: () => false},
  isActive: {type: Boolean, required: true, default: () => true},
  zipCode: {type: String, default: () => null},
});

// schema.virtual('name').get(function (this: UserDocument) {
//   return this.firstName && this.lastName ? `${this.firstName} ${this.lastName}` : `${this.username}`;
// });

schema.index({username: 1}, {unique: true});
schema.index({slug: 1}, {unique: true});
schema.index({uid: 1}, {unique: true});

schema.set('toJSON', {virtuals: true});

export interface UserMediaDocument
  extends Document<Types.ObjectId | string>,
    UserMediaModel {}

export interface UserDocument
  extends Document<Types.ObjectId | string>,
    UserModel {}

export const User = model<UserDocument>('User', schema, 'User');
