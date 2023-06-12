/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Document, Types } from 'mongoose';
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
}
export interface UserMediaDocument extends Document<Types.ObjectId | string>, UserMediaModel {
}
export interface UserDocument extends Document<Types.ObjectId | string>, UserModel {
}
export declare const User: import("mongoose").Model<UserDocument, {}, {}, {}, any>;
