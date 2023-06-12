import {model, Schema, Document, Types} from 'mongoose';

export interface CMSUserModel {
  createdAt: number;
  updatedAt: number;
  slug: string;
  firstName: string;
  lastName: string;
  contactNumber?: string | null;
  jobTitle?: string | null;
  country?: string | null;
  birthDate?: string | null;
  profilePhotoID?: string | null;
  uid: string;
  email: string;
  displayName: string;
  accessLevel: string;
  invitedBy: string;

  // virtuals
  name?: string | null;
}

const schema = new Schema<CMSUserDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  updatedAt: {type: Number, default: () => new Date().getTime()},
  slug: String,
  firstName: String,
  lastName: String,
  contactNumber: String,
  jobTitle: String,
  country: String,
  birthDate: String,
  profilePhotoID: String,
  uid: String,
  email: String,
  displayName: String,
  accessLevel: String,
  invitedBy: String,
});

schema.virtual('name').get(function (this: CMSUserDocument) {
  return `${this.firstName} ${this.lastName}`;
});

schema.index({CMSUsername: 1}, {unique: true});
schema.index({slug: 1}, {unique: true});
schema.index({uid: 1}, {unique: true});

schema.set('toJSON', {virtuals: true});

export interface CMSUserDocument
  extends Document<Types.ObjectId | string>,
    CMSUserModel {}

export const CMSUser = model<CMSUserDocument>('CMSUser', schema, 'CMSUser');
